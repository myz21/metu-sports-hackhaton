"""
Test script for the Voice Coaching Pipeline.
Uses music/test-voice.m4a as input and saves output audio.
"""
import asyncio
import sys
import os

# Add local and sibling module directories to path for imports
VOICE2_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(VOICE2_DIR)
ROOT_DIR = os.path.dirname(SRC_DIR)
VOICE_DIR = os.path.join(SRC_DIR, "voice")

for path in (VOICE2_DIR, VOICE_DIR):
    if path not in sys.path:
        sys.path.append(path)

from audio_analyzer import AudioAnalyzer
from coaching_engine import CoachingEngine
from tts_engine_final import TTSEngine

# Paths
AUDIO_PATH = os.path.join(ROOT_DIR, "music", "test-voice.m4a")
OUTPUT_PATH = os.path.join(VOICE2_DIR, "output_test.mp3")

async def main():
    print("=" * 60)
    print("🎙️ VOICE COACHING PIPELINE TEST - CUE-BASED MIXING")
    print("=" * 60)

    # Step 1: Verify audio file exists
    print(f"\n📁 Input Audio: {AUDIO_PATH}")
    if not os.path.exists(AUDIO_PATH):
        print(f"❌ ERROR: Audio file not found at {AUDIO_PATH}")
        return

    # Step 2: Analyze Audio with librosa
    print("\n🔬 Step 1: Analyzing Audio with Librosa...")
    analyzer = AudioAnalyzer(AUDIO_PATH)
    audio_data = analyzer.analyze_beats()
    print(f"   ✅ Tempo: {audio_data['tempo']:.1f} BPM")
    print(f"   ✅ Duration: {audio_data['duration']:.1f}s")
    print(f"   ✅ Beat count: {len(audio_data['beat_times'])}")

    # Get energy profile
    energy = analyzer.get_energy_profile()
    print(f"   ✅ Energy segments: {[f'{e:.3f}' for e in energy]}")

    # Step 3: Generate Coaching Cues
    print("\n📝 Step 2: Generating Coaching Cues...")
    dummy_program = [
        {"time": min(5.0, audio_data['duration'] * 0.2), "action": "Spin"},
        {"time": min(12.0, audio_data['duration'] * 0.5), "action": "Double Axel"},
        {"time": min(20.0, audio_data['duration'] * 0.75), "action": "Jump"}
    ]

    engine = CoachingEngine(audio_data, dummy_program)
    cues = engine.generate_cues()
    print(f"   ✅ Generated {len(cues)} coaching cues:")
    for cue in cues:
        print(f"      [{cue['time']:.1f}s] {cue['text']}")

    # Step 4: Generate TTS and mix with music
    print(f"\n🎤 Step 3: Generating TTS + Mixing with Music...")
    tts = TTSEngine(voice="tr-TR-AhmetNeural", engine_type="edge")

    # METHOD 1: Individual TTS per cue (best quality, requires internet)
    try:
        cue_files = await tts.generate_cue_audios(cues)
        # Mix individual cues
        # (This would require additional pydub mixing code)
        print("   Individual TTS generated successfully")
    except Exception as e:
        print(f"   Individual TTS failed (internet?): {e}")

    # METHOD 2: Single TTS + proportional split (fallback)
    print(f"\n🎵 Step 4: Generating combined TTS + mixing with ducking...")
    full_text = " ".join([c['text'] for c in cues])
    temp_tts_path = "/tmp/combined_tts.mp3"
    await tts.generate_audio(full_text, temp_tts_path)

    # Mix using the proportional split method
    tts.mix_cues_with_music(
        music_path=AUDIO_PATH,
        cues=cues,
        output_path=OUTPUT_PATH,
        music_duck_db=-10,
        tts_boost_db=6,
        use_existing_tts=temp_tts_path
    )

    # Verify
    import librosa
    y_out, sr_out = librosa.load(OUTPUT_PATH)
    output_duration = librosa.get_duration(y=y_out, sr=sr_out)

    file_size = os.path.getsize(OUTPUT_PATH)

    print(f"\n{'='*60}")
    print("🎯 PIPELINE COMPLETE")
    print(f"{'='*60}")
    print(f"   Input duration:  {audio_data['duration']:.1f}s")
    print(f"   Output duration: {output_duration:.1f}s")
    print(f"   Match: {'✅ YES' if abs(output_duration - audio_data['duration']) < 2 else '❌ NO'}")
    print(f"   File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
    print(f"   Output: {OUTPUT_PATH}")

    # Cleanup
    if os.path.exists(temp_tts_path):
        os.remove(temp_tts_path)

    print(f"\n{'='*60}")
    print("🎉 Pipeline completed successfully!")
    print(f"{'='*60}")

if __name__ == "__main__":
    asyncio.run(main())
