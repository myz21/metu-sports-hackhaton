"""Audio beat and energy analysis for the voice coaching pipeline."""

from __future__ import annotations

import os
import subprocess
import tempfile
from pathlib import Path


class AudioAnalyzer:
    def __init__(self, file_path: str | Path):
        self.file_path = str(file_path)
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Audio file not found: {self.file_path}")

        librosa = _import_librosa()
        try:
            self.y, self.sr = librosa.load(self.file_path)
        except Exception:
            converted_path = self._convert_to_wav(self.file_path)
            self.y, self.sr = librosa.load(converted_path)

    def analyze_beats(self) -> dict[str, object]:
        librosa = _import_librosa()
        tempo, beat_frames = librosa.beat.beat_track(y=self.y, sr=self.sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=self.sr)
        return {
            "tempo": float(tempo),
            "beat_times": beat_times.tolist(),
            "duration": float(librosa.get_duration(y=self.y, sr=self.sr)),
            "energy_profile": self.get_energy_profile(),
        }

    def get_energy_profile(self, n_segments: int = 10) -> list[float]:
        librosa = _import_librosa()
        np = _import_numpy()
        rms = librosa.feature.rms(y=self.y)[0]
        segments = np.array_split(rms, n_segments)
        return [float(np.mean(segment)) for segment in segments]

    def _convert_to_wav(self, file_path: str) -> str:
        ffmpeg_path = _import_imageio_ffmpeg().get_ffmpeg_exe()
        handle = tempfile.NamedTemporaryFile(delete=False, suffix="_voice_input.wav")
        handle.close()
        output_path = handle.name

        subprocess.run(
            [
                ffmpeg_path,
                "-y",
                "-i",
                file_path,
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


def _import_librosa():
    import librosa  # type: ignore

    return librosa


def _import_numpy():
    import numpy as np  # type: ignore

    return np


def _import_imageio_ffmpeg():
    import imageio_ffmpeg  # type: ignore

    return imageio_ffmpeg
