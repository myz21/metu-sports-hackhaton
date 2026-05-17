"""CLI for SkateSync AI planned-vs-actual performance review."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .vlm_review import compare_performance_to_plan_vlm


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Compare a skating practice video against a planned choreography list."
        )
    )
    parser.add_argument("video_path", help="Path to the practice video file.")
    parser.add_argument(
        "plan_path",
        help=(
            "Path to a JSON file containing planned elements. Accepts either a list "
            "or an object with a 'planned_elements' array."
        ),
    )
    parser.add_argument(
        "--output",
        help="Optional path to write the resulting JSON report.",
    )
    parser.add_argument(
        "--include-llm-feedback",
        action="store_true",
        help="Generate structured OpenAI feedback from the deterministic review output.",
    )
    parser.add_argument(
        "--quality",
        choices=["low", "high"],
        default="low",
        help=(
            "User-facing analysis quality profile. 'low' is cheaper and faster; "
            "'high' uses a richer review configuration."
        ),
    )
    parser.add_argument(
        "--api-key",
        help="OpenAI API key. Optional if OPENAI_API_KEY is already set.",
    )
    parser.add_argument(
        "--model",
        help="Optional override for the OpenAI model used by the selected quality profile.",
    )
    parser.add_argument(
        "--language",
        default="English",
        help="Language for the generated explanation output.",
    )
    parser.add_argument(
        "--knowledge-base",
        help=(
            "Optional path to a skating knowledge JSON corpus for local RAG retrieval. "
            "Defaults to src/vision/knowledge/figure_skating_knowledge.json."
        ),
    )
    parser.add_argument(
        "--rag-top-k",
        type=int,
        default=None,
        help="Number of retrieved skating knowledge documents per element for the VLM backend.",
    )
    parser.add_argument(
        "--cheap-mode",
        action=argparse.BooleanOptionalAction,
        default=None,
        help=(
            "Cost-aware VLM mode. Keeps image detail low, shrinks frame count, "
            "and compacts RAG context unless disabled. Defaults are derived from --quality."
        ),
    )
    parser.add_argument(
        "--frame-padding-seconds",
        type=float,
        default=None,
        help="Extra seconds before and after each planned window when sampling frames for the VLM backend.",
    )
    parser.add_argument(
        "--max-frames-per-element",
        type=int,
        default=None,
        help="Maximum sampled frames per planned element for the VLM backend.",
    )
    parser.add_argument(
        "--image-detail",
        choices=["low", "high", "auto", "original"],
        help="Vision detail level passed to the OpenAI image input items.",
    )
    parser.add_argument(
        "--frame-max-dimension",
        type=int,
        help="Optional maximum image dimension before JPEG encoding for the VLM backend.",
    )
    parser.add_argument(
        "--jpeg-quality",
        type=int,
        default=None,
        help="JPEG quality used when encoding sampled frames for the VLM backend.",
    )
    parser.add_argument(
        "--max-rag-context-chars",
        type=int,
        help="Optional hard cap for the injected RAG context length in characters.",
    )

    args = parser.parse_args()
    planned_elements = _load_planned_elements(args.plan_path)
    result = compare_performance_to_plan_vlm(
        args.video_path,
        planned_elements,
        api_key=args.api_key,
        model=args.model,
        language=args.language,
        include_llm_feedback=args.include_llm_feedback,
        quality_profile=args.quality,
        cheap_mode=args.cheap_mode,
        frame_padding_seconds=args.frame_padding_seconds,
        max_frames_per_element=args.max_frames_per_element,
        frame_max_dimension=args.frame_max_dimension,
        jpeg_quality=args.jpeg_quality,
        image_detail=args.image_detail,
        knowledge_path=args.knowledge_base,
        rag_top_k=args.rag_top_k,
        max_rag_context_chars=args.max_rag_context_chars,
    )

    rendered = json.dumps(result, indent=2, ensure_ascii=False)

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(rendered, encoding="utf-8")
        print(f"Saved review report to {output_path}")
    else:
        print(rendered)


def _load_planned_elements(plan_path: str | Path) -> list[dict[str, Any]]:
    path = Path(plan_path)
    if not path.exists():
        raise FileNotFoundError(f"Plan JSON not found: {path}")

    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        planned_elements = payload
    elif isinstance(payload, dict) and isinstance(payload.get("planned_elements"), list):
        planned_elements = payload["planned_elements"]
    else:
        raise ValueError(
            "Plan JSON must be either a list of elements or an object with "
            "'planned_elements'."
        )

    if not planned_elements:
        raise ValueError("The plan JSON does not contain any planned elements.")

    return planned_elements


if __name__ == "__main__":
    main()
