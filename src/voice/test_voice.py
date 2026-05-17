"""Simple end-to-end runner for the OpenAI-only voice coaching pipeline."""

from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path


VOICE_DIR = Path(__file__).resolve().parent
SRC_DIR = VOICE_DIR.parent
ROOT_DIR = SRC_DIR.parent

if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from src.voice.main import process_voice_session


DEFAULT_PLAN = ROOT_DIR / "src" / "voice" / "examples" / "planned_elements.sample.json"


async def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python src/voice/test_voice.py <audio_path> [plan_path]")
        return

    audio_path = Path(sys.argv[1]).resolve()
    plan_path = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else DEFAULT_PLAN.resolve()

    print("=" * 60)
    print("OPENAI VOICE COACHING PIPELINE TEST")
    print("=" * 60)
    print(f"Audio: {audio_path}")
    print(f"Plan:  {plan_path}")

    if not audio_path.exists():
        print(f"ERROR: Audio file not found at {audio_path}")
        return

    if not plan_path.exists():
        print(f"ERROR: Plan file not found at {plan_path}")
        return

    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY is not set.")
        return

    result = await process_voice_session(
        audio_path,
        plan_path=plan_path,
        output_dir=ROOT_DIR / "src" / "voice" / "output" / "test_voice",
        include_tts=False,
        mix_audio=False,
    )

    summary = {
        "session_id": result["session_id"],
        "planned_elements_count": len(result["planned_elements"]),
        "cue_count": len(result["cues"]),
        "audio_analysis_path": result["audio_analysis_path"],
        "planned_elements_path": result["planned_elements_path"],
        "coaching_cues_path": result["coaching_cues_path"],
        "coaching_text_path": result["coaching_text_path"],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print("=" * 60)
    print("Voice pipeline completed.")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
