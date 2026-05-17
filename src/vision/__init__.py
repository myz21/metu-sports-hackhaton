"""SkateSync AI Python helpers."""

from __future__ import annotations

import os
import json
from pathlib import Path
from typing import Any
from dotenv import load_dotenv

# Automatically load environment variables from parent project root or current working directory
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")
load_dotenv()

from .llm_feedback import generate_openai_feedback
from .vlm_review import compare_performance_to_plan_vlm


def compare_performance_to_plan(
    video_path: str | Path,
    planned_elements: list[dict[str, Any]],
    **kwargs: Any,
) -> dict[str, Any]:
    """VLM-only compatibility wrapper for planned-vs-actual review."""

    return compare_performance_to_plan_vlm(video_path, planned_elements, **kwargs)


def compare_performance_to_plan_to_json(
    video_path: str | Path,
    planned_elements: list[dict[str, Any]],
    **kwargs: Any,
) -> str:
    """Run the VLM review and return the JSON string output."""

    return json.dumps(
        compare_performance_to_plan(video_path, planned_elements, **kwargs),
        indent=2,
        ensure_ascii=False,
    )


__all__ = [
    "compare_performance_to_plan",
    "compare_performance_to_plan_to_json",
    "compare_performance_to_plan_vlm",
    "generate_openai_feedback",
]
