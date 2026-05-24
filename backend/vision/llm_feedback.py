"""Optional OpenAI-based explanation layer for SkateSync AI reviews."""

from __future__ import annotations

import json
import os
from typing import Any


def generate_openai_feedback(
    review_result: dict[str, Any],
    *,
    api_key: str | None = None,
    model: str = "gpt-4.1-mini",
    language: str = "English",
) -> dict[str, Any]:
    """Generate structured coaching language from deterministic review metrics.

    The numeric scores must come from the rule-based review system. This function
    only explains those metrics in human language.
    """

    try:
        from openai import OpenAI
    except ImportError as exc:  # pragma: no cover - optional dependency
        raise ImportError(
            "The openai package is required for LLM feedback. Install it before "
            "calling generate_openai_feedback()."
        ) from exc

    resolved_api_key = api_key or os.getenv("OPENAI_API_KEY")
    if not resolved_api_key:
        raise ValueError(
            "No OpenAI API key provided. Pass api_key=... or set OPENAI_API_KEY."
        )

    client = OpenAI(api_key=resolved_api_key)
    response = client.responses.create(
        model=model,
        instructions=(
            "You are SkateSync AI, an MVP skating training feedback assistant. "
            "Explain only the supplied metrics. Do not invent official judging rules. "
            "Do not classify movement types from video. The movement names already come "
            "from the planned timeline. If pose coverage is low, mention lower confidence. "
            f"Write the explanation in {language}. Return JSON that matches the schema."
        ),
        input=(
            "Review this planned-vs-actual skating analysis and summarize it for the athlete.\n\n"
            + json.dumps(_compact_review_payload(review_result), ensure_ascii=False, indent=2)
        ),
        text={
            "format": {
                "type": "json_schema",
                "name": "skatesync_training_feedback",
                "strict": True,
                "schema": _llm_feedback_schema(),
            }
        },
    )

    if not getattr(response, "output_text", None):
        raise ValueError("The OpenAI response did not contain text output.")

    return json.loads(response.output_text)


def _compact_review_payload(review_result: dict[str, Any]) -> dict[str, Any]:
    return {
        "overall": review_result["overall"],
        "elements": [
            {
                "name": element["name"],
                "type": element["type"],
                "scores": element["scores"],
                "timing_comparison": element["timing_comparison"],
                "motion_metrics": element["motion_metrics"],
                "local_feedback": element["local_feedback"],
            }
            for element in review_result["elements"]
        ],
    }


def _llm_feedback_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "overall_summary": {"type": "string"},
            "overall_coach_feedback": {"type": "string"},
            "priority_actions": {
                "type": "array",
                "items": {"type": "string"},
            },
            "element_feedback": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "name": {"type": "string"},
                        "summary": {"type": "string"},
                        "timing_note": {"type": "string"},
                        "stability_note": {"type": "string"},
                        "next_action": {"type": "string"},
                        "confidence_note": {"type": "string"},
                    },
                    "required": [
                        "name",
                        "summary",
                        "timing_note",
                        "stability_note",
                        "next_action",
                        "confidence_note",
                    ],
                },
            },
        },
        "required": [
            "overall_summary",
            "overall_coach_feedback",
            "priority_actions",
            "element_feedback",
        ],
    }
