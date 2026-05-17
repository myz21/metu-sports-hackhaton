"""OpenAI text-to-speech support for cue synthesis."""

from __future__ import annotations

import asyncio
import os
import subprocess
import tempfile
from pathlib import Path
from typing import Any


DEFAULT_TTS_MODEL = os.getenv("SKATESYNC_TTS_MODEL", "gpt-4o-mini-tts")
DEFAULT_TTS_VOICE = os.getenv("SKATESYNC_TTS_VOICE", "alloy")


class TTSEngine:
    def __init__(
        self,
        *,
        api_key: str | None = None,
        model: str = DEFAULT_TTS_MODEL,
        voice: str = DEFAULT_TTS_VOICE,
        output_dir: str | Path | None = None,
        client: Any | None = None,
    ):
        self.model = model
        self.voice = voice
        self.output_dir = Path(output_dir) if output_dir else Path(tempfile.gettempdir()) / "skatesync_voice_cues"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.client = client or _build_openai_client(api_key)

    async def generate_cue_audios(self, cues: list[dict[str, Any]]) -> list[dict[str, Any]]:
        tasks = []
        clip_meta: list[dict[str, Any]] = []
        for index, cue in enumerate(cues):
            output_path = self.output_dir / f"cue_{index:03d}.mp3"
            tasks.append(self._generate_audio_async(cue["text"], output_path))
            clip_meta.append(
                {
                    "index": index,
                    "time": float(cue["time"]),
                    "text": cue["text"],
                    "path": str(output_path),
                    "cue_kind": cue.get("cue_kind", "cue"),
                    "element_name": cue.get("element_name", ""),
                }
            )

        await asyncio.gather(*tasks)

        for item in clip_meta:
            wav_path = self._convert_to_wav(item["path"])
            clip = _import_audio_segment().from_wav(wav_path)
            item["duration_ms"] = len(clip)
            item["lead_in_ms"] = self._detect_leading_silence_ms(clip)

        return clip_meta

    async def _generate_audio_async(self, text: str, output_path: Path) -> str:
        return await asyncio.to_thread(self._generate_audio, text, output_path)

    def _generate_audio(self, text: str, output_path: Path) -> str:
        response = self.client.audio.speech.create(
            model=self.model,
            voice=self.voice,
            input=text,
        )
        response.stream_to_file(str(output_path))
        return str(output_path)

    def _convert_to_wav(self, input_path: str) -> str:
        ffmpeg_path = _import_imageio_ffmpeg().get_ffmpeg_exe()
        handle = tempfile.NamedTemporaryFile(delete=False, suffix="_cue.wav")
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

    def _detect_leading_silence_ms(self, audio_segment: Any, threshold_db: float = -40.0) -> int:
        trim_ms = 0
        step_ms = 5
        while trim_ms < len(audio_segment):
            if audio_segment[trim_ms : trim_ms + step_ms].dBFS > threshold_db:
                break
            trim_ms += step_ms
        return trim_ms


def _build_openai_client(api_key: str | None):
    from openai import OpenAI  # type: ignore

    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required for TTSEngine.")
    return OpenAI(api_key=key)


def _import_imageio_ffmpeg():
    import imageio_ffmpeg  # type: ignore

    return imageio_ffmpeg


def _import_audio_segment():
    from pydub import AudioSegment  # type: ignore

    AudioSegment.converter = _import_imageio_ffmpeg().get_ffmpeg_exe()
    return AudioSegment
