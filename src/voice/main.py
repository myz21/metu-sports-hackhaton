"""End-to-end OpenAI voice coaching session runner."""

from __future__ import annotations

import asyncio
import json
import os
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any

from .audio_analyzer import AudioAnalyzer
from .coaching_engine import CoachingEngine, DEFAULT_COACH_MODEL
from .program_planner import ProgramPlanner, DEFAULT_PLANNER_MODEL
from .tts_engine import DEFAULT_TTS_MODEL, DEFAULT_TTS_VOICE, TTSEngine


def load_planned_elements(plan_path: str | Path) -> list[dict[str, Any]]:
    payload = json.loads(Path(plan_path).read_text(encoding="utf-8"))
    if isinstance(payload, dict) and "planned_elements" in payload:
        return list(payload["planned_elements"])
    if isinstance(payload, list):
        return payload
    raise ValueError("Plan JSON must be either a list or an object with 'planned_elements'.")


def export_json(payload: Any, output_path: str | Path) -> str:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return str(path)


def export_cue_texts(cues: list[dict[str, Any]], output_path: str | Path) -> str:
    lines = []
    for cue in cues:
        lines.append(
            f"[{cue['time']:.3f}s] ({cue['cue_kind']}) {cue['element_name']}: {cue['text']}"
        )
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return str(path)


def mix_audio_session(
    music_path: str | Path,
    cue_audio_files: list[dict[str, Any]],
    output_path: str | Path,
    *,
    playback_latency_ms: int = 120,
    tts_gain_db: int = 8,
) -> str:
    ffmpeg_path = _import_imageio_ffmpeg().get_ffmpeg_exe()
    audio_segment_cls = _import_audio_segment()

    music_wav_path = _convert_to_wav(str(music_path), ffmpeg_path)
    background = audio_segment_cls.from_wav(music_wav_path)
    mixed = background

    for clip in cue_audio_files:
        cue_audio = audio_segment_cls.from_wav(_convert_to_wav(clip["path"], ffmpeg_path)) + tts_gain_db
        cue_audio = cue_audio.fade_in(15).fade_out(45)
        position_ms = max(
            0,
            int(round(clip["time"] * 1000)) - int(clip.get("lead_in_ms", 0)) - playback_latency_ms,
        )
        mixed = mixed.overlay(cue_audio, position=position_ms)

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    mixed.export(str(output), format="mp3", bitrate="192k")
    return str(output)


async def process_voice_session(
    audio_path: str | Path,
    *,
    session_id: str | None = None,
    plan_path: str | Path | None = None,
    output_dir: str | Path | None = None,
    api_key: str | None = None,
    planner_model: str = DEFAULT_PLANNER_MODEL,
    coach_model: str = DEFAULT_COACH_MODEL,
    tts_model: str = DEFAULT_TTS_MODEL,
    tts_voice: str = DEFAULT_TTS_VOICE,
    include_tts: bool = False,
    mix_audio: bool = False,
    knowledge_path: str | None = None,
) -> dict[str, Any]:
    session_id = session_id or datetime.utcnow().strftime("voice_%Y%m%d_%H%M%S")
    output_root = Path(output_dir) if output_dir else Path("src/voice/output") / session_id
    output_root.mkdir(parents=True, exist_ok=True)

    analyzer = AudioAnalyzer(audio_path)
    audio_data = analyzer.analyze_beats()

    if plan_path:
        planned_elements = load_planned_elements(plan_path)
    else:
        planner = ProgramPlanner(
            audio_data,
            api_key=api_key,
            model=planner_model,
            knowledge_path=knowledge_path,
        )
        planned_elements = planner.generate_program()

    coach = CoachingEngine(
        audio_data,
        planned_elements,
        api_key=api_key,
        model=coach_model,
        knowledge_path=knowledge_path,
    )
    cues = coach.generate_cues()

    audio_analysis_path = export_json(audio_data, output_root / "audio_analysis.json")
    planned_elements_path = export_json(
        {"planned_elements": planned_elements},
        output_root / "planned_elements.json",
    )
    cue_json_path = export_json({"cues": cues}, output_root / "coaching_cues.json")
    cue_text_path = export_cue_texts(cues, output_root / "coaching_cues.txt")

    cue_audio_files: list[dict[str, Any]] = []
    mixed_audio_path: str | None = None

    if include_tts:
        tts = TTSEngine(
            api_key=api_key,
            model=tts_model,
            voice=tts_voice,
            output_dir=output_root / "cue_audio",
        )
        cue_audio_files = await tts.generate_cue_audios(cues)
        export_json({"cue_audio_files": cue_audio_files}, output_root / "cue_audio_files.json")

        if mix_audio:
            mixed_audio_path = mix_audio_session(
                audio_path,
                cue_audio_files,
                output_root / "coaching_mix.mp3",
            )

    return {
        "session_id": session_id,
        "audio_analysis_path": audio_analysis_path,
        "planned_elements_path": planned_elements_path,
        "coaching_cues_path": cue_json_path,
        "coaching_text_path": cue_text_path,
        "mixed_audio_path": mixed_audio_path,
        "planned_elements": planned_elements,
        "cues": cues,
        "cue_audio_files": cue_audio_files,
    }


def _convert_to_wav(input_path: str, ffmpeg_path: str) -> str:
    handle = tempfile.NamedTemporaryFile(delete=False, suffix="_voice_mix.wav")
    handle.close()
    output_path = handle.name
    subprocess.run(
        [
            ffmpeg_path,
            "-y",
            "-i",
            input_path,
            "-vn",
            "-acodec",
            "pcm_s16le",
            output_path,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return output_path


def _import_imageio_ffmpeg():
    import imageio_ffmpeg  # type: ignore

    return imageio_ffmpeg


def _import_audio_segment():
    from pydub import AudioSegment  # type: ignore

    AudioSegment.converter = _import_imageio_ffmpeg().get_ffmpeg_exe()
    return AudioSegment
