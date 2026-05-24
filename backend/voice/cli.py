"""CLI for the OpenAI-only voice coaching pipeline."""

from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from .main import process_voice_session
from .tts_engine import DEFAULT_TTS_MODEL, DEFAULT_TTS_VOICE
from .program_planner import DEFAULT_PLANNER_MODEL
from .coaching_engine import DEFAULT_COACH_MODEL


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run the SkateSync AI OpenAI-only voice coaching pipeline.",
    )
    parser.add_argument("audio_path", help="Path to the input music file.")
    parser.add_argument(
        "--plan",
        dest="plan_path",
        help="Optional planned_elements JSON. If omitted, the planner generates one.",
    )
    parser.add_argument(
        "--output-dir",
        default="src/voice/output/run",
        help="Directory where JSON and optional audio outputs will be saved.",
    )
    parser.add_argument("--session-id", help="Optional session id for naming outputs.")
    parser.add_argument("--api-key", help="Optional OpenAI API key override.")
    parser.add_argument(
        "--planner-model",
        default=DEFAULT_PLANNER_MODEL,
        help=f"OpenAI text model for program planning. Default: {DEFAULT_PLANNER_MODEL}",
    )
    parser.add_argument(
        "--coach-model",
        default=DEFAULT_COACH_MODEL,
        help=f"OpenAI text model for cue generation. Default: {DEFAULT_COACH_MODEL}",
    )
    parser.add_argument(
        "--tts-model",
        default=DEFAULT_TTS_MODEL,
        help=f"OpenAI TTS model. Default: {DEFAULT_TTS_MODEL}",
    )
    parser.add_argument(
        "--tts-voice",
        default=DEFAULT_TTS_VOICE,
        help=f"OpenAI TTS voice. Default: {DEFAULT_TTS_VOICE}",
    )
    parser.add_argument(
        "--include-tts",
        action="store_true",
        help="Generate individual cue audio clips with OpenAI TTS.",
    )
    parser.add_argument(
        "--mix-audio",
        action="store_true",
        help="Mix generated cue clips over the source music. Requires --include-tts.",
    )
    parser.add_argument(
        "--knowledge-path",
        help="Optional path to the movement knowledge JSON.",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    result = asyncio.run(
        process_voice_session(
            args.audio_path,
            session_id=args.session_id,
            plan_path=args.plan_path,
            output_dir=args.output_dir,
            api_key=args.api_key,
            planner_model=args.planner_model,
            coach_model=args.coach_model,
            tts_model=args.tts_model,
            tts_voice=args.tts_voice,
            include_tts=args.include_tts,
            mix_audio=args.mix_audio,
            knowledge_path=args.knowledge_path,
        )
    )

    summary = {
        "session_id": result["session_id"],
        "planned_elements_count": len(result["planned_elements"]),
        "cue_count": len(result["cues"]),
        "audio_analysis_path": result["audio_analysis_path"],
        "planned_elements_path": result["planned_elements_path"],
        "coaching_cues_path": result["coaching_cues_path"],
        "coaching_text_path": result["coaching_text_path"],
        "mixed_audio_path": result["mixed_audio_path"],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
