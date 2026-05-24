"""OpenAI VLM-based planned-vs-actual skating review."""

from __future__ import annotations

import json
import os
from pathlib import Path
from statistics import mean
from typing import Any

from .frame_extractor import extract_window_frames
from .llm_feedback import generate_openai_feedback
from .rag import build_rag_context

QUALITY_PROFILES = {
    "low": {
        "model": "gpt-4.1-mini",
        "cheap_mode": True,
        "frame_padding_seconds": 0.5,
        "max_frames_per_element": 4,
        "frame_max_dimension": 768,
        "jpeg_quality": 72,
        "image_detail": "low",
        "rag_top_k": 2,
        "max_rag_context_chars": 900,
    },
    "high": {
        "model": "gpt-4.1",
        "cheap_mode": False,
        "frame_padding_seconds": 0.4,
        "max_frames_per_element": 6,
        "frame_max_dimension": 1024,
        "jpeg_quality": 82,
        "image_detail": "high",
        "rag_top_k": 4,
        "max_rag_context_chars": 1600,
    },
}


def compare_performance_to_plan_vlm(
    video_path: str | Path,
    planned_elements: list[dict[str, Any]],
    *,
    api_key: str | None = None,
    model: str | None = None,
    language: str = "English",
    include_llm_feedback: bool = True,
    quality_profile: str = "low",
    cheap_mode: bool | None = None,
    frame_padding_seconds: float | None = None,
    max_frames_per_element: int | None = None,
    frame_max_dimension: int | None = None,
    jpeg_quality: int | None = None,
    image_detail: str | None = None,
    knowledge_path: str | Path | None = None,
    rag_top_k: int | None = None,
    max_rag_context_chars: int | None = None,
) -> dict[str, Any]:
    """Use OpenAI vision + local skating RAG context to review a performance."""

    try:
        from openai import OpenAI
    except ImportError as exc:  # pragma: no cover - runtime dependency
        raise ImportError(
            "The openai package is required for the VLM review backend."
        ) from exc

    resolved_api_key = api_key or os.getenv("OPENAI_API_KEY")
    if not resolved_api_key:
        raise ValueError(
            "No OpenAI API key provided. Pass api_key=... or set OPENAI_API_KEY."
        )

    if not planned_elements:
        raise ValueError("planned_elements must contain at least one element.")

    resolved_quality = _resolve_quality_settings(
        quality_profile=quality_profile,
        model=model,
        cheap_mode=cheap_mode,
        frame_padding_seconds=frame_padding_seconds,
        max_frames_per_element=max_frames_per_element,
        frame_max_dimension=frame_max_dimension,
        jpeg_quality=jpeg_quality,
        image_detail=image_detail,
        rag_top_k=rag_top_k,
        max_rag_context_chars=max_rag_context_chars,
    )

    client = OpenAI(api_key=resolved_api_key)
    element_reviews = []

    for element in planned_elements:
        reviewed = _review_single_element(
            client=client,
            model=resolved_quality["model"],
            language=language,
            video_path=video_path,
            planned_element=element,
            quality_profile=resolved_quality["quality_profile"],
            cheap_mode=resolved_quality["cheap_mode"],
            frame_padding_seconds=resolved_quality["frame_padding_seconds"],
            max_frames_per_element=resolved_quality["max_frames_per_element"],
            frame_max_dimension=resolved_quality["frame_max_dimension"],
            jpeg_quality=resolved_quality["jpeg_quality"],
            image_detail=resolved_quality["image_detail"],
            knowledge_path=knowledge_path,
            rag_top_k=resolved_quality["rag_top_k"],
            max_rag_context_chars=resolved_quality["max_rag_context_chars"],
        )
        element_reviews.append(reviewed)

    overall = _build_vlm_overall_review(element_reviews)
    result = {
        "analysis_type": "vlm_planned_vs_actual_training_review",
        "backend": "openai_vlm_rag",
        "video_path": str(video_path),
        "planned_element_count": len(planned_elements),
        "runtime_profile": {
            "quality_profile": resolved_quality["quality_profile"],
            "model": resolved_quality["model"],
            "cheap_mode": resolved_quality["cheap_mode"],
            "image_detail": resolved_quality["image_detail"],
            "max_frames_per_element": resolved_quality["max_frames_per_element"],
            "frame_padding_seconds": resolved_quality["frame_padding_seconds"],
            "frame_max_dimension": resolved_quality["frame_max_dimension"],
            "jpeg_quality": resolved_quality["jpeg_quality"],
            "rag_top_k": resolved_quality["rag_top_k"],
            "max_rag_context_chars": resolved_quality["max_rag_context_chars"],
            "include_llm_feedback": include_llm_feedback,
        },
        "overall": overall,
        "elements": element_reviews,
    }

    if include_llm_feedback:
        result["llm_feedback"] = generate_openai_feedback(
            result,
            api_key=resolved_api_key,
            model=resolved_quality["model"],
            language=language,
        )

    return result


def _review_single_element(
    *,
    client: Any,
    model: str,
    language: str,
    video_path: str | Path,
    planned_element: dict[str, Any],
    quality_profile: str,
    cheap_mode: bool,
    frame_padding_seconds: float,
    max_frames_per_element: int,
    frame_max_dimension: int | None,
    jpeg_quality: int,
    image_detail: str,
    knowledge_path: str | Path | None,
    rag_top_k: int,
    max_rag_context_chars: int | None,
) -> dict[str, Any]:
    validated = _validate_planned_element(planned_element)
    request_budget = _resolve_request_budget(
        planned_element=validated,
        quality_profile=quality_profile,
        cheap_mode=cheap_mode,
        frame_padding_seconds=frame_padding_seconds,
        max_frames_per_element=max_frames_per_element,
        frame_max_dimension=frame_max_dimension,
        jpeg_quality=jpeg_quality,
        image_detail=image_detail,
        rag_top_k=rag_top_k,
        max_rag_context_chars=max_rag_context_chars,
    )
    frame_bundle = extract_window_frames(
        video_path,
        start_time=validated["start_time"],
        end_time=validated["end_time"],
        padding_seconds=request_budget["frame_padding_seconds"],
        max_frames=request_budget["max_frames"],
        max_dimension=request_budget["frame_max_dimension"],
        jpeg_quality=request_budget["jpeg_quality"],
    )
    rag_context = build_rag_context(
        movement_name=validated["name"],
        movement_type=validated["type"],
        top_k=request_budget["rag_top_k"],
        knowledge_path=knowledge_path,
        compact=request_budget["compact_rag"],
        max_chars=request_budget["max_rag_context_chars"],
        max_items_per_section=request_budget["max_rag_items_per_section"],
    )

    response = client.responses.create(
        model=model,
        instructions=(
            "You are SkateSync AI's skating performance review assistant. "
            "You are reviewing a planned figure-skating element against sampled frames from a practice video. "
            "Do not invent official judging rules. Do not classify a new movement. "
            "Use the provided planned element name and timing as the reference. "
            "Estimate apparent start, end, and peak times from the sampled frames. "
            "Keep coaching text concise. "
            f"Write observations in {language}. Return only JSON matching the schema."
        ),
        input=[
            {
                "role": "user",
                "content": _build_vlm_input_content(
                    planned_element=validated,
                    frame_bundle=frame_bundle,
                    rag_context=rag_context,
                    image_detail=request_budget["image_detail"],
                ),
            }
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "skatesync_vlm_element_review",
                "strict": True,
                "schema": _vlm_element_schema(),
            }
        },
    )

    if not getattr(response, "output_text", None):
        raise ValueError("OpenAI VLM review did not return text output.")

    vlm_payload = json.loads(response.output_text)
    return _score_vlm_element(
        validated,
        frame_bundle,
        rag_context,
        vlm_payload,
        request_budget,
    )


def _build_vlm_input_content(
    *,
    planned_element: dict[str, Any],
    frame_bundle: dict[str, Any],
    rag_context: dict[str, Any],
    image_detail: str,
) -> list[dict[str, Any]]:
    timestamps = ", ".join(
        str(frame["timestamp_seconds"]) for frame in frame_bundle["frames"]
    )
    prompt_text = (
        "Planned element review request.\n\n"
        f"Element name: {planned_element['name']}\n"
        f"Element type: {planned_element['type']}\n"
        f"Planned start time: {planned_element['start_time']}\n"
        f"Planned end time: {planned_element['end_time']}\n"
        f"Planned duration: {planned_element['end_time'] - planned_element['start_time']}\n"
        f"Music peak time: {planned_element['music_peak_time']}\n\n"
        "You are given sampled frames from this time window. "
        f"The images appear in this exact timestamp order: {timestamps}.\n"
        "Use them to estimate apparent timing, stability, and alignment with the planned phrase.\n\n"
        "Retrieved skating knowledge context:\n"
        f"{rag_context['prompt_context']}\n\n"
        "Review only this planned element."
    )

    content: list[dict[str, Any]] = [{"type": "input_text", "text": prompt_text}]
    for frame in frame_bundle["frames"]:
        content.append(
            {
                "type": "input_image",
                "image_url": frame["image_data_url"],
                "detail": image_detail,
            }
        )
    return content


def _score_vlm_element(
    planned_element: dict[str, Any],
    frame_bundle: dict[str, Any],
    rag_context: dict[str, Any],
    vlm_payload: dict[str, Any],
    request_budget: dict[str, Any],
) -> dict[str, Any]:
    planned_duration = planned_element["end_time"] - planned_element["start_time"]
    actual_start = float(vlm_payload["apparent_start_time"])
    actual_end = float(vlm_payload["apparent_end_time"])
    actual_peak = float(vlm_payload["apparent_peak_time"])
    actual_duration = max(0.0, actual_end - actual_start)

    start_offset = actual_start - planned_element["start_time"]
    duration_offset = actual_duration - planned_duration
    timing_offset = actual_peak - planned_element["music_peak_time"]

    confidence_score = round(_clamp(float(vlm_payload["confidence"]) * 100.0, 0.0, 100.0), 1)
    start_tolerance = _offset_tolerance(planned_duration, factor=0.32)
    duration_tolerance = _offset_tolerance(planned_duration, factor=0.38)
    music_tolerance = _offset_tolerance(planned_duration, factor=0.30)
    start_score = _score_offset(abs(start_offset), tolerance_seconds=start_tolerance)
    duration_score = _score_offset(abs(duration_offset), tolerance_seconds=duration_tolerance)
    stability_score = _map_stability_label(vlm_payload["stability_assessment"])
    music_alignment_score = _score_offset(abs(timing_offset), tolerance_seconds=music_tolerance)

    rule_assessment = {
        "timing_assessment": _directional_label(
            start_offset,
            tolerance_seconds=start_tolerance,
            negative_label="early",
            positive_label="late",
            centered_label="on_time",
        ),
        "duration_assessment": _directional_label(
            duration_offset,
            tolerance_seconds=duration_tolerance,
            negative_label="short",
            positive_label="long",
            centered_label="on_target",
        ),
        "music_alignment_assessment": _score_band(
            music_alignment_score,
            strong_threshold=85.0,
            moderate_threshold=60.0,
            strong_label="strong",
            moderate_label="moderate",
            weak_label="weak",
        ),
    }

    weights = _weights_for_type(planned_element["type"])
    execution_match_score = round(
        (start_score * weights["start"])
        + (duration_score * weights["duration"])
        + (stability_score * weights["stability"])
        + (music_alignment_score * weights["music"])
        + (confidence_score * weights["confidence"]),
        1,
    )

    local_feedback = _build_rule_based_feedback(
        planned_element=planned_element,
        rule_assessment=rule_assessment,
        start_offset=start_offset,
        duration_offset=duration_offset,
        timing_offset=timing_offset,
        coaching_cue=vlm_payload["coaching_cue"],
        confidence_note=vlm_payload["confidence_note"],
    )

    return {
        "name": planned_element["name"],
        "type": planned_element["type"],
        "planned_window": {
            "start_time": planned_element["start_time"],
            "end_time": planned_element["end_time"],
            "music_peak_time": planned_element["music_peak_time"],
            "planned_duration_seconds": round(planned_duration, 3),
        },
        "actual_window": {
            "start_time": round(actual_start, 3),
            "end_time": round(actual_end, 3),
            "peak_time": round(actual_peak, 3),
            "duration_seconds": round(actual_duration, 3),
        },
        "scores": {
            "execution_match_score": execution_match_score,
            "start_score": start_score,
            "duration_score": duration_score,
            "stability_score": stability_score,
            "music_alignment_score": music_alignment_score,
            "confidence_score": confidence_score,
        },
        "timing_comparison": {
            "start_offset_seconds": round(start_offset, 3),
            "duration_offset_seconds": round(duration_offset, 3),
            "timing_offset_seconds": round(timing_offset, 3),
        },
        "rule_assessment": rule_assessment,
        "motion_metrics": {
            "frame_count": len(frame_bundle["frames"]),
            "frame_window_start": frame_bundle["window_start"],
            "frame_window_end": frame_bundle["window_end"],
            "vlm_confidence": round(float(vlm_payload["confidence"]), 3),
        },
        "request_profile": {
            "quality_profile": request_budget["quality_profile"],
            "cheap_mode": request_budget["cheap_mode"],
            "image_detail": request_budget["image_detail"],
            "frame_padding_seconds": request_budget["frame_padding_seconds"],
            "frame_max_dimension": request_budget["frame_max_dimension"],
            "jpeg_quality": request_budget["jpeg_quality"],
            "rag_top_k": request_budget["rag_top_k"],
            "max_rag_context_chars": request_budget["max_rag_context_chars"],
        },
        "vlm_observation": vlm_payload,
        "rag_context": {
            "document_ids": rag_context["document_ids"],
            "document_titles": rag_context["document_titles"],
        },
        "local_feedback": local_feedback,
        "window_feedback": "VLM review completed using sampled frames and local skating RAG context.",
    }


def _build_vlm_overall_review(element_reviews: list[dict[str, Any]]) -> dict[str, Any]:
    if not element_reviews:
        return {
            "overall_match_score": 0.0,
            "average_start_score": 0.0,
            "average_duration_score": 0.0,
            "average_stability_score": 0.0,
            "average_music_alignment_score": 0.0,
            "summary": "No elements were reviewed.",
        }

    overall_match_score = round(
        mean(item["scores"]["execution_match_score"] for item in element_reviews),
        1,
    )
    avg_start = round(mean(item["scores"]["start_score"] for item in element_reviews), 1)
    avg_duration = round(
        mean(item["scores"]["duration_score"] for item in element_reviews),
        1,
    )
    avg_stability = round(
        mean(item["scores"]["stability_score"] for item in element_reviews),
        1,
    )
    avg_music = round(
        mean(item["scores"]["music_alignment_score"] for item in element_reviews),
        1,
    )

    summary = []
    if avg_start < 65:
        summary.append("Several elements appear to begin too far from their planned start.")
    else:
        summary.append("Most elements stay reasonably close to their planned entry timing.")

    if avg_music < 65:
        summary.append("Musical alignment still needs work.")
    else:
        summary.append("Musical alignment is generally convincing.")

    if avg_stability < 65:
        summary.append("Visual control and body-line stability are the main weaknesses.")
    else:
        summary.append("Visual control looks usable for an MVP review pass.")

    return {
        "overall_match_score": overall_match_score,
        "average_start_score": avg_start,
        "average_duration_score": avg_duration,
        "average_stability_score": avg_stability,
        "average_music_alignment_score": avg_music,
        "summary": " ".join(summary),
    }


def _resolve_quality_settings(
    *,
    quality_profile: str,
    model: str | None,
    cheap_mode: bool | None,
    frame_padding_seconds: float | None,
    max_frames_per_element: int | None,
    frame_max_dimension: int | None,
    jpeg_quality: int | None,
    image_detail: str | None,
    rag_top_k: int | None,
    max_rag_context_chars: int | None,
) -> dict[str, Any]:
    profile_key = str(quality_profile).lower()
    if profile_key not in QUALITY_PROFILES:
        raise ValueError(
            f"Unsupported quality_profile: {quality_profile}. Expected one of: {', '.join(sorted(QUALITY_PROFILES))}."
        )

    profile = QUALITY_PROFILES[profile_key]
    return {
        "quality_profile": profile_key,
        "model": model or profile["model"],
        "cheap_mode": profile["cheap_mode"] if cheap_mode is None else cheap_mode,
        "frame_padding_seconds": (
            profile["frame_padding_seconds"]
            if frame_padding_seconds is None
            else frame_padding_seconds
        ),
        "max_frames_per_element": (
            profile["max_frames_per_element"]
            if max_frames_per_element is None
            else max_frames_per_element
        ),
        "frame_max_dimension": (
            profile["frame_max_dimension"]
            if frame_max_dimension is None
            else frame_max_dimension
        ),
        "jpeg_quality": profile["jpeg_quality"] if jpeg_quality is None else jpeg_quality,
        "image_detail": profile["image_detail"] if image_detail is None else image_detail,
        "rag_top_k": profile["rag_top_k"] if rag_top_k is None else rag_top_k,
        "max_rag_context_chars": (
            profile["max_rag_context_chars"]
            if max_rag_context_chars is None
            else max_rag_context_chars
        ),
    }


def _resolve_request_budget(
    *,
    planned_element: dict[str, Any],
    quality_profile: str,
    cheap_mode: bool,
    frame_padding_seconds: float,
    max_frames_per_element: int,
    frame_max_dimension: int | None,
    jpeg_quality: int,
    image_detail: str,
    rag_top_k: int,
    max_rag_context_chars: int | None,
) -> dict[str, Any]:
    planned_duration = planned_element["end_time"] - planned_element["start_time"]

    if cheap_mode:
        max_frames = min(max_frames_per_element, _cheap_frame_budget(planned_duration))
        rag_documents = min(rag_top_k, 2)
        padding = min(frame_padding_seconds, 0.5)
        max_dimension = frame_max_dimension or 768
        quality = min(jpeg_quality, 72)
        rag_chars = (
            min(max_rag_context_chars, 900)
            if max_rag_context_chars is not None
            else 900
        )
        max_rag_items_per_section = 1
    else:
        max_frames = max_frames_per_element
        rag_documents = rag_top_k
        padding = frame_padding_seconds
        max_dimension = frame_max_dimension
        quality = jpeg_quality
        rag_chars = max_rag_context_chars
        max_rag_items_per_section = 2

    return {
        "quality_profile": quality_profile,
        "cheap_mode": cheap_mode,
        "max_frames": max(1, max_frames),
        "rag_top_k": max(1, rag_documents),
        "frame_padding_seconds": padding,
        "frame_max_dimension": max_dimension,
        "jpeg_quality": quality,
        "image_detail": image_detail,
        "max_rag_context_chars": rag_chars,
        "compact_rag": cheap_mode,
        "max_rag_items_per_section": max_rag_items_per_section,
    }


def _cheap_frame_budget(planned_duration: float) -> int:
    if planned_duration <= 3.0:
        return 2
    if planned_duration <= 8.0:
        return 3
    return 4


def _directional_label(
    offset_seconds: float,
    *,
    tolerance_seconds: float,
    negative_label: str,
    positive_label: str,
    centered_label: str,
) -> str:
    centered_threshold = tolerance_seconds * 0.2
    if offset_seconds < -centered_threshold:
        return negative_label
    if offset_seconds > centered_threshold:
        return positive_label
    return centered_label


def _score_band(
    score: float,
    *,
    strong_threshold: float,
    moderate_threshold: float,
    strong_label: str,
    moderate_label: str,
    weak_label: str,
) -> str:
    if score >= strong_threshold:
        return strong_label
    if score >= moderate_threshold:
        return moderate_label
    return weak_label


def _build_rule_based_feedback(
    *,
    planned_element: dict[str, Any],
    rule_assessment: dict[str, str],
    start_offset: float,
    duration_offset: float,
    timing_offset: float,
    coaching_cue: str,
    confidence_note: str,
) -> dict[str, str]:
    timing_sentence = _timing_sentence(planned_element["name"], start_offset)
    duration_sentence = _duration_sentence(duration_offset)
    music_sentence = _music_sentence(timing_offset)

    short_feedback = " ".join(
        sentence
        for sentence in [timing_sentence, duration_sentence, music_sentence]
        if sentence
    )

    return {
        "short_feedback": short_feedback,
        "next_action": coaching_cue,
        "confidence_note": confidence_note,
        "review_scope": (
            f"{planned_element['name']} was evaluated against the provided planned window using sampled frames."
        ),
        "timing_assessment": rule_assessment["timing_assessment"],
        "duration_assessment": rule_assessment["duration_assessment"],
        "music_alignment_assessment": rule_assessment["music_alignment_assessment"],
    }


def _timing_sentence(element_name: str, start_offset: float) -> str:
    seconds = round(abs(start_offset), 2)
    if seconds < 0.05:
        return f"{element_name} starts essentially on time."
    if start_offset > 0:
        return f"{element_name} starts about {seconds} seconds late."
    return f"{element_name} starts about {seconds} seconds early."


def _duration_sentence(duration_offset: float) -> str:
    seconds = round(abs(duration_offset), 2)
    if seconds < 0.05:
        return "Its duration stays close to plan."
    if duration_offset > 0:
        return f"It runs about {seconds} seconds longer than planned."
    return f"It finishes about {seconds} seconds earlier than planned."


def _music_sentence(timing_offset: float) -> str:
    seconds = round(abs(timing_offset), 2)
    if seconds < 0.15:
        return "Its strongest moment lands close to the planned music peak."
    if timing_offset > 0:
        return f"The strongest visual moment lands about {seconds} seconds after the planned music peak."
    return f"The strongest visual moment lands about {seconds} seconds before the planned music peak."


def _validate_planned_element(planned_element: dict[str, Any]) -> dict[str, Any]:
    required = {"name", "type", "start_time", "end_time", "music_peak_time"}
    missing = required - planned_element.keys()
    if missing:
        missing_str = ", ".join(sorted(missing))
        raise ValueError(f"Planned element is missing required fields: {missing_str}")

    element = {
        "name": str(planned_element["name"]),
        "type": str(planned_element["type"]),
        "start_time": float(planned_element["start_time"]),
        "end_time": float(planned_element["end_time"]),
        "music_peak_time": float(planned_element["music_peak_time"]),
    }
    if element["end_time"] <= element["start_time"]:
        raise ValueError(f"{element['name']}: end_time must be after start_time.")
    return element


def _weights_for_type(element_type: str) -> dict[str, float]:
    lowered = str(element_type).lower()
    if lowered == "spin":
        return {"start": 0.22, "duration": 0.16, "stability": 0.32, "music": 0.20, "confidence": 0.10}
    if lowered == "jump":
        return {"start": 0.28, "duration": 0.10, "stability": 0.24, "music": 0.23, "confidence": 0.15}
    if lowered in {"sequence", "step_sequence"}:
        return {"start": 0.22, "duration": 0.20, "stability": 0.16, "music": 0.27, "confidence": 0.15}
    if lowered in {"transition", "pose", "choreography"}:
        return {"start": 0.26, "duration": 0.22, "stability": 0.14, "music": 0.23, "confidence": 0.15}
    return {"start": 0.25, "duration": 0.18, "stability": 0.20, "music": 0.22, "confidence": 0.15}


def _score_offset(offset_seconds: float, *, tolerance_seconds: float) -> float:
    if tolerance_seconds <= 0:
        return 0.0

    ratio = offset_seconds / tolerance_seconds
    raw_score = 100.0 / (1.0 + pow(ratio, 1.6))
    return round(_clamp(raw_score, 0.0, 100.0), 1)


def _offset_tolerance(planned_duration: float, *, factor: float) -> float:
    return _clamp(planned_duration * factor, 0.45, 2.2)


def _map_stability_label(label: str) -> float:
    mapping = {
        "stable": 90.0,
        "moderate": 72.0,
        "unstable": 42.0,
        "unclear": 58.0,
    }
    return mapping.get(str(label).lower(), 58.0)

def _vlm_element_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "apparent_start_time": {"type": "number"},
            "apparent_end_time": {"type": "number"},
            "apparent_peak_time": {"type": "number"},
            "stability_assessment": {
                "type": "string",
                "enum": ["stable", "moderate", "unstable", "unclear"],
            },
            "confidence": {"type": "number"},
            "coaching_cue": {"type": "string"},
            "confidence_note": {"type": "string"},
            "technical_observations": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 3,
            },
        },
        "required": [
            "apparent_start_time",
            "apparent_end_time",
            "apparent_peak_time",
            "stability_assessment",
            "confidence",
            "coaching_cue",
            "confidence_note",
            "technical_observations",
        ],
    }


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))
