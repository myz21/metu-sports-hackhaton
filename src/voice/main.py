import asyncio
import json
import os
import subprocess
import sys

import imageio_ffmpeg
from dotenv import load_dotenv
from pydub import AudioSegment

VOICE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(VOICE_DIR)
ROOT_DIR = os.path.dirname(SRC_DIR)

if VOICE_DIR not in sys.path:
    sys.path.append(VOICE_DIR)

from audio_analyzer import AudioAnalyzer
from coaching_engine import CoachingEngine
from firebase_handler import FirebaseHandler
from tts_engine import TTSEngine

load_dotenv()

AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()

PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "skatesync-ai-metu-2026")
DEFAULT_AUDIO = os.path.join(ROOT_DIR, "music", "test-voice.m4a")
DEFAULT_OUTPUT = os.path.join(VOICE_DIR, "output_test.mp3")


def _select_tts_engine() -> TTSEngine:
    if os.getenv("OPENAI_API_KEY"):
        return TTSEngine(voice="nova", engine_type="openai")
    return TTSEngine(voice="tr-TR-AhmetNeural", engine_type="edge")


def _convert_to_wav(input_path: str, output_path: str) -> str:
    subprocess.run(
        [
            imageio_ffmpeg.get_ffmpeg_exe(),
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


def mix_audio_session(
    music_path: str,
    cue_audio_files: list[dict],
    output_path: str,
    playback_latency_ms: int = 120,
    tts_gain_db: int = 5,
):
    music_wav_path = _convert_to_wav(music_path, "/tmp/voice_mix_music.wav")
    background = AudioSegment.from_wav(music_wav_path)
    mixed = background

    for clip in cue_audio_files:
        clip_wav_path = _convert_to_wav(clip["path"], f"/tmp/voice_mix_cue_{clip['index']:03d}.wav")
        cue_audio = AudioSegment.from_wav(clip_wav_path) + tts_gain_db
        cue_audio = cue_audio.fade_in(15).fade_out(40)
        position_ms = max(
            0,
            int(round(clip["time"] * 1000)) - int(clip.get("lead_in_ms", 0)) - playback_latency_ms,
        )
        mixed = mixed.overlay(cue_audio, position=position_ms)
        print(
            f"   MIX [{clip['time']:.3f}s -> {position_ms}ms] "
            f"lead_in={clip.get('lead_in_ms', 0)}ms "
            f"duration={clip.get('duration_ms', 0)}ms :: {clip['text']}"
        )

    mixed.export(output_path, format="mp3", bitrate="192k")
    return output_path


async def process_voice_coaching(audio_path, session_id, planned_program=None, output_path=None):
    output_path = output_path or os.path.join(VOICE_DIR, f"output_{session_id}.mp3")
    print(f"--- Starting Voice Coaching Pipeline for {session_id} ---")

    analyzer = AudioAnalyzer(audio_path)
    audio_data = analyzer.analyze_beats()
    print(
        f"Audio analyzed: {audio_data['tempo']:.1f} BPM, "
        f"{audio_data['duration']:.1f}s, energy={audio_data['energy_profile']}"
    )

    engine = CoachingEngine(audio_data, planned_program)
    cues = engine.generate_cues()
    print("Gemini cue JSON:")
    print(json.dumps(cues, ensure_ascii=False, indent=2))

    tts = _select_tts_engine()
    cue_audio_files = await tts.generate_cue_audios(cues)
    mix_audio_session(audio_path, cue_audio_files, output_path)

    try:
        handler = FirebaseHandler(PROJECT_ID)
        public_url = handler.upload_audio(output_path, f"coaching/{os.path.basename(output_path)}")
        handler.save_coaching_plan(session_id, cues, public_url)
        print(f"Success! Public URL: {public_url}")
    except Exception as exc:
        print(f"Firebase Step skipped or failed (check credentials): {exc}")

    print("--- Pipeline Completed ---")
    return {
        "audio_data": audio_data,
        "cues": cues,
        "cue_audio_files": cue_audio_files,
        "output_path": output_path,
    }


if __name__ == "__main__":
    dummy_program = [
        {"time": 5.0, "action": "Spin"},
        {"time": 12.0, "action": "Double Axel"},
    ]
    asyncio.run(
        process_voice_coaching(
            DEFAULT_AUDIO,
            "test_session_001",
            dummy_program,
            DEFAULT_OUTPUT,
        )
    )
