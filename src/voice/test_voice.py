"""
Test script for the Voice Coaching Pipeline.
Uses music/test-voice.m4a as input and saves output audio.
"""
import asyncio
import json
import os
import sys

import librosa

VOICE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(VOICE_DIR)
ROOT_DIR = os.path.dirname(SRC_DIR)

for path in (VOICE_DIR,):
    if path not in sys.path:
        sys.path.append(path)

from audio_analyzer import AudioAnalyzer
from main import process_voice_coaching
from program_planner import ProgramPlanner

AUDIO_PATH = os.path.join(ROOT_DIR, "music", "test-voice.m4a")
OUTPUT_PATH = os.path.join(VOICE_DIR, "output_test.mp3")


async def main():
    print("=" * 60)
    print("🎙️ VOICE COACHING PIPELINE TEST")
    print("=" * 60)

    print(f"\n📁 Input Audio: {AUDIO_PATH}")
    if not os.path.exists(AUDIO_PATH):
        print(f"❌ ERROR: Audio file not found at {AUDIO_PATH}")
        return

    print("\n🔬 Step 1: Analyzing Audio with Librosa...")
    analyzer = AudioAnalyzer(AUDIO_PATH)
    audio_data = analyzer.analyze_beats()
    print(f"   ✅ Tempo: {audio_data['tempo']:.1f} BPM")
    print(f"   ✅ Duration: {audio_data['duration']:.1f}s")
    print(f"   ✅ Beat count: {len(audio_data['beat_times'])}")
    print(f"   ✅ Energy segments: {[f'{e:.3f}' for e in audio_data['energy_profile']]}")

    print("\n📝 Step 2: Generating Gemini-ready Program...")
    planner = ProgramPlanner(audio_data)
    dynamic_program = planner.generate_program()
    print(json.dumps(dynamic_program, ensure_ascii=False, indent=2))

    print("\n🎤 Step 3: Running Hybrid Coaching Pipeline...")
    result = await process_voice_coaching(
        AUDIO_PATH,
        session_id="test_session_001",
        planned_program=dynamic_program,
        output_path=OUTPUT_PATH,
    )

    print("\n🧾 Step 4: Verifying Mixed Output...")
    y_out, sr_out = librosa.load(OUTPUT_PATH)
    output_duration = librosa.get_duration(y=y_out, sr=sr_out)
    file_size = os.path.getsize(OUTPUT_PATH)

    print(f"   ✅ Cue count: {len(result['cues'])}")
    print(f"   ✅ Output duration: {output_duration:.1f}s")
    print(f"   ✅ Input duration:  {audio_data['duration']:.1f}s")
    print(f"   ✅ Duration match: {'YES' if abs(output_duration - audio_data['duration']) < 1.5 else 'NO'}")
    print(f"   ✅ File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
    print(f"   ✅ Output path: {OUTPUT_PATH}")
    print(f"   ✅ Text path: {result['text_output_path']}")
    print(f"   ✅ JSON path: {result['json_output_path']}")

    print("\n" + "=" * 60)
    print("🎯 Pipeline completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
