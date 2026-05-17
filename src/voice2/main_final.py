import asyncio
import os
import sys
from dotenv import load_dotenv

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
from firebase_handler import FirebaseHandler

# Configuration - Your NEW Firebase Project ID
PROJECT_ID = "skatesync-ai-metu-2026"
DEFAULT_AUDIO = os.path.join(ROOT_DIR, "music", "test-voice.m4a")

load_dotenv()

async def process_voice_coaching(audio_path, session_id, planned_program=None):
    print(f"--- Starting Voice Coaching Pipeline for {session_id} ---")

    # 1. Analyze Audio
    analyzer = AudioAnalyzer(audio_path)
    audio_data = analyzer.analyze_beats()
    print(f"Audio analyzed: {audio_data['tempo']:.1f} BPM, {audio_data['duration']:.1f}s")

    # 2. Generate Coaching Cues
    engine = CoachingEngine(audio_data, planned_program)
    cues = engine.generate_cues()
    print(f"Generated {len(cues)} coaching cues.")

    # 3. Generate TTS and mix with music
    has_openai_key = bool(os.getenv("OPENAI_API_KEY"))
    engine_type = "openai" if has_openai_key else "edge"
    voice = "nova" if engine_type == "openai" else "tr-TR-AhmetNeural"
    tts = TTSEngine(voice=voice, engine_type=engine_type)
    print(f"TTS engine selected: {engine_type}")

    # Generate combined TTS
    full_text = " ".join([c['text'] for c in cues])
    temp_tts_path = f"/tmp/tts_{session_id}.mp3"
    await tts.generate_audio(full_text, temp_tts_path)

    # Mix with music using proportional cue distribution
    output_filename = os.path.join(VOICE2_DIR, f"output_{session_id}.mp3")
    tts.mix_cues_with_music(
        music_path=audio_path,
        cues=cues,
        output_path=output_filename,
        music_duck_db=-10,
        tts_boost_db=6,
        use_existing_tts=temp_tts_path
    )

    # 4. Firebase Upload & Storage
    try:
        handler = FirebaseHandler(PROJECT_ID)
        public_url = handler.upload_audio(output_filename, f"coaching/{output_filename}")
        handler.save_coaching_plan(session_id, cues, public_url)
        print(f"Success! Public URL: {public_url}")
    except Exception as e:
        print(f"Firebase Step skipped or failed (check credentials): {e}")

    # Cleanup
    if os.path.exists(temp_tts_path):
        os.remove(temp_tts_path)

    print("--- Pipeline Completed ---")

if __name__ == "__main__":
    # Test Run
    dummy_program = [
        {"time": 5.0, "action": "Spin"},
        {"time": 12.0, "action": "Double Axel"}
    ]

    asyncio.run(process_voice_coaching(DEFAULT_AUDIO, "test_session_001", dummy_program))
