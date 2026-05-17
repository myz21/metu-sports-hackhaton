import asyncio
import os
import subprocess
from typing import Any

import edge_tts
import imageio_ffmpeg
from dotenv import load_dotenv
from openai import OpenAI
from pydub import AudioSegment

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()


class TTSEngine:
    def __init__(self, voice="nova", engine_type="openai", output_dir="/tmp/cue_audios"):
        self.voice = voice
        self.engine_type = engine_type
        self.output_dir = output_dir

    async def generate_audio(self, text: str, output_path: str):
        if self.engine_type == "openai":
            return await asyncio.to_thread(self._generate_openai, text, output_path)
        return await self._generate_edge(text, output_path)

    def _generate_openai(self, text: str, output_path: str):
        response = client.audio.speech.create(
            model="tts-1",
            voice=self.voice,
            input=text,
        )
        response.stream_to_file(output_path)
        return output_path

    async def _generate_edge(self, text: str, output_path: str):
        voice = self.voice if "Neural" in self.voice else "tr-TR-AhmetNeural"
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        return output_path

    def _detect_leading_silence_ms(self, audio_segment: AudioSegment, threshold_db: float = -40.0) -> int:
        trim_ms = 0
        step_ms = 5
        while trim_ms < len(audio_segment):
            if audio_segment[trim_ms:trim_ms + step_ms].dBFS > threshold_db:
                break
            trim_ms += step_ms
        return trim_ms

    def _convert_to_wav(self, input_path: str, output_path: str) -> str:
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

    async def generate_cue_audios(self, cues: list[dict[str, Any]]) -> list[dict[str, Any]]:
        os.makedirs(self.output_dir, exist_ok=True)
        tasks = []
        clip_meta: list[dict[str, Any]] = []

        for index, cue in enumerate(cues):
            output_path = os.path.join(self.output_dir, f"cue_{index:03d}.mp3")
            tasks.append(self.generate_audio(cue["text"], output_path))
            clip_meta.append(
                {
                    "index": index,
                    "time": float(cue["time"]),
                    "text": cue["text"],
                    "path": output_path,
                }
            )

        await asyncio.gather(*tasks)

        for item in clip_meta:
            wav_path = self._convert_to_wav(item["path"], item["path"].replace(".mp3", ".wav"))
            clip = AudioSegment.from_wav(wav_path)
            item["duration_ms"] = len(clip)
            item["lead_in_ms"] = self._detect_leading_silence_ms(clip)

        return clip_meta
