import os
import subprocess
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba_cache")

import librosa
import numpy as np
import imageio_ffmpeg

class AudioAnalyzer:
    def __init__(self, file_path):
        self.file_path = file_path
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")

        # Load audio directly first; if the source container is unsupported,
        # convert it with ffmpeg and retry from a temporary WAV file.
        try:
            self.y, self.sr = librosa.load(file_path)
        except Exception:
            converted_path = self._convert_to_wav(file_path)
            self.y, self.sr = librosa.load(converted_path)

    def _convert_to_wav(self, file_path):
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        output_path = os.path.join("/tmp", f"{base_name}_librosa.wav")

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

    def analyze_beats(self):
        """Extracts tempo and beat timestamps in seconds."""
        tempo, beat_frames = librosa.beat.beat_track(y=self.y, sr=self.sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=self.sr)
        energy_profile = self.get_energy_profile()
        
        return {
            "tempo": float(tempo),
            "beat_times": beat_times.tolist(),
            "duration": float(librosa.get_duration(y=self.y, sr=self.sr)),
            "energy_profile": energy_profile,
        }

    def get_energy_profile(self, n_segments=10):
        """Divides audio into segments and calculates average energy (RMS) for each."""
        rms = librosa.feature.rms(y=self.y)[0]
        segments = np.array_split(rms, n_segments)
        energy_profile = [float(np.mean(seg)) for seg in segments]
        return energy_profile

if __name__ == "__main__":
    # Quick test
    import sys
    if len(sys.argv) > 1:
        analyzer = AudioAnalyzer(sys.argv[1])
        results = analyzer.analyze_beats()
        print(f"Tempo: {results['tempo']:.2f} BPM")
        print(f"Total Beats: {len(results['beat_times'])}")
        print(f"Energy Profile: {analyzer.get_energy_profile()}")
