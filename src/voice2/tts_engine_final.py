import asyncio
import edge_tts
import os
import subprocess
from openai import OpenAI
from dotenv import load_dotenv
import imageio_ffmpeg

# Load API Key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

class TTSEngine:
    def __init__(self, voice="nova", engine_type="edge"):
        """
        engine_type: 'openai' or 'edge'
        voices (openai): alloy, echo, fable, onyx, nova, shimmer
        voices (edge): tr-TR-AhmetNeural, tr-TR-EmelNeural, en-US-AriaNeural, etc.
        """
        self.voice = voice
        self.engine_type = engine_type

    @property
    def openai_available(self):
        return client is not None

    async def generate_audio(self, text, output_path):
        """Generates an MP3 file from text."""
        if self.engine_type == "openai" and client:
            return self._generate_openai(text, output_path)
        else:
            return await self._generate_edge(text, output_path)

    def _generate_openai(self, text, output_path):
        print(f"  [OpenAI TTS] '{text[:30]}...' -> {output_path}")
        response = client.audio.speech.create(
            model="tts-1",
            voice=self.voice,
            input=text
        )
        response.stream_to_file(output_path)
        return output_path

    async def _generate_edge(self, text, output_path):
        print(f"  [Edge TTS] '{text[:30]}...' -> {output_path}")
        voice = self.voice if "Neural" in self.voice else "tr-TR-AhmetNeural"
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        return output_path

    def generate_audio_sync(self, text, output_path):
        """Synchronous wrapper for generate_audio."""
        return asyncio.run(self.generate_audio(text, output_path))

    def _convert_to_wav(self, input_path, output_path):
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

    async def generate_cue_audios(self, cues, output_dir="/tmp/cue_audios"):
        """
        Generates individual audio files for each cue.
        Returns list of (cue_time, audio_path) tuples.
        """
        os.makedirs(output_dir, exist_ok=True)
        cue_audio_files = []

        for i, cue in enumerate(cues):
            text = cue['text']
            cue_time = cue['time']
            output_path = os.path.join(output_dir, f"cue_{i:03d}_{cue_time:.1f}s.mp3")

            await self.generate_audio(text, output_path)
            cue_audio_files.append((cue_time, output_path))

        return cue_audio_files

    def mix_cues_with_music(self, music_path, cues, output_path, 
                           music_duck_db=-10, tts_boost_db=6,
                           use_existing_tts=None):
        """
        Mixes TTS cues with music track at specified times.

        Args:
            music_path: Path to background music
            cues: List of {'time': float, 'text': str} dicts
            output_path: Output file path
            music_duck_db: How much to reduce music volume
            tts_boost_db: How much to boost TTS volume
            use_existing_tts: Optional path to pre-generated TTS file 
                             (splits it proportionally across cues)
        """
        print(f"\n🎵 Mixing {len(cues)} cues with music...")

        try:
            from pydub import AudioSegment
        except ImportError as exc:
            raise ImportError(
                "pydub is required for mixing TTS with music. "
                "Install it with `pip install pydub`."
            ) from exc

        AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()

        # Load music
        music_wav_path = self._convert_to_wav(music_path, "/tmp/voice2_music.wav")
        music = AudioSegment.from_wav(music_wav_path)
        music_ducked = music + music_duck_db
        mixed = music_ducked

        if use_existing_tts and os.path.exists(use_existing_tts):
            # Split existing TTS proportionally across cues
            tts_wav_path = self._convert_to_wav(use_existing_tts, "/tmp/voice2_tts.wav")
            tts_total = AudioSegment.from_wav(tts_wav_path)
            total_chars = sum(len(c['text']) for c in cues)

            current_ms = 0
            for cue in cues:
                ratio = len(cue['text']) / total_chars
                duration_ms = int(len(tts_total) * ratio)

                segment = tts_total[current_ms:current_ms + duration_ms]
                current_ms += duration_ms

                # Format matching
                if segment.channels == 1:
                    segment = segment.set_channels(music.channels)
                if segment.frame_rate != music.frame_rate:
                    segment = segment.set_frame_rate(music.frame_rate)

                # Boost and overlay
                segment = segment + tts_boost_db
                cue_time_ms = int(cue['time'] * 1000)
                mixed = mixed.overlay(segment, position=cue_time_ms)

                print(f"   ✅ [{cue['time']:.1f}s] '{cue['text'][:25]}...' ({duration_ms/1000:.1f}s)")
        else:
            # Individual TTS per cue (requires generate_cue_audios first)
            raise NotImplementedError("Individual TTS generation not implemented in this mode. "
                                    "Use generate_cue_audios() first or provide use_existing_tts.")

        # Export
        mixed.export(output_path, format="mp3", bitrate="192k")

        final_duration = len(mixed) / 1000
        print(f"\n✅ Mix complete: {output_path} ({final_duration:.1f}s)")
        return output_path

if __name__ == "__main__":
    # Quick test
    engine = TTSEngine()
    test_text = "Merhaba! SkateSync AI koçluk seansına hoş geldiniz."
    engine.generate_audio_sync(test_text, "test_output.mp3")
    print("Test audio generated: test_output.mp3")
