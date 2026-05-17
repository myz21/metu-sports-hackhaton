"""OpenAI-based planned element generator for SkateSync AI."""

from __future__ import annotations

import json
import os
from typing import Any

from .knowledge import build_catalog_overview


DEFAULT_PLANNER_MODEL = os.getenv("SKATESYNC_PLANNER_MODEL", "gpt-4o-mini")

PROGRAM_SCHEMA = {
    "type": "object",
    "properties": {
        "planned_elements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "type": {
                        "type": "string",
                        "enum": [
                            "jump",
                            "spin",
                            "turns",
                            "sequence",
                            "transition",
                            "pose",
                        ],
                    },
                    "start_time": {"type": "number"},
                    "end_time": {"type": "number"},
                    "music_peak_time": {"type": "number"},
                },
                "required": [
                    "name",
                    "type",
                    "start_time",
                    "end_time",
                    "music_peak_time",
                ],
                "additionalProperties": False,
            },
        }
    },
    "required": ["planned_elements"],
    "additionalProperties": False,
}

DEFAULT_DURATIONS = {
    "jump": 1.2,
    "spin": 2.2,
    "turns": 1.3,
    "sequence": 4.0,
    "transition": 2.0,
    "pose": 1.5,
}


class ProgramPlanner:
    def __init__(
        self,
        audio_data: dict[str, Any],
        *,
        api_key: str | None = None,
        model: str = DEFAULT_PLANNER_MODEL,
        knowledge_path: str | None = None,
        client: Any | None = None,
    ):
        self.audio_data = audio_data
        self.model = model
        self.knowledge_path = knowledge_path
        self.client = client or _build_openai_client(api_key)

    def generate_program(self) -> list[dict[str, Any]]:
        duration = round(float(self.audio_data.get("duration", 0)), 2)
        tempo = round(float(self.audio_data.get("tempo", 0)), 2)
        energy_profile = [round(float(item), 3) for item in self.audio_data.get("energy_profile", [])]
        beat_sample = [round(float(item), 3) for item in self.audio_data.get("beat_times", [])[:32]]
        movement_catalog = build_catalog_overview(self.knowledge_path)

        input_items = [
            {
                "role": "system",
                "content": (
                    "Sen artistik buz pateni ve artistik roller skating icin deneyimli bir koreografi planlayicisisin. "
                    "Gorevin, verilen muzik sureci icinde mantikli, akici ve sporcu dostu bir planned_elements listesi "
                    "uretmek. Ciktin yalnizca JSON schema'ya uymali. Hareket isimleri gercek paten hareketleri olmali. "
                    "Liste duzgun yayilmali, ayni anda cakismaz sekilde akmali ve muzik peak anlariyla mantikli sekilde "
                    "eslesmeli."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "duration_seconds": duration,
                        "tempo_bpm": tempo,
                        "energy_profile": energy_profile,
                        "beat_sample": beat_sample,
                        "movement_catalog": movement_catalog,
                        "planning_rules": {
                            "target_density": _target_density(duration),
                            "required_shape": [
                                "opening flow or transition",
                                "at least one spin",
                                "at least one rhythm-driven section or turns/sequence",
                                "a closing element or pose",
                            ],
                            "notes": [
                                "Use movement types that match the movement catalog.",
                                "Spread elements across the full track.",
                                "Longer expressive moments can be transitions or sequences.",
                                "Jump windows should stay comparatively short.",
                            ],
                        },
                    },
                    ensure_ascii=False,
                ),
            },
        ]

        payload = _responses_json(
            client=self.client,
            model=self.model,
            input_items=input_items,
            schema_name="planned_program",
            schema=PROGRAM_SCHEMA,
        )
        return normalize_planned_elements(payload.get("planned_elements", []), duration)


def normalize_planned_elements(
    planned_elements: list[dict[str, Any]],
    duration: float,
) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    cursor = 0.0

    for raw in sorted(planned_elements, key=lambda item: float(item.get("start_time", 0.0))):
        element_type = _normalize_type(str(raw.get("type", "transition")))
        element_name = str(raw.get("name", element_type.title())).strip() or element_type.title()

        min_duration = DEFAULT_DURATIONS[element_type]
        start_time = max(0.0, min(float(raw.get("start_time", 0.0)), duration))
        end_time = max(start_time + min_duration, float(raw.get("end_time", start_time + min_duration)))
        music_peak_time = float(raw.get("music_peak_time", start_time))

        if start_time < cursor:
            start_time = cursor
            end_time = max(end_time, start_time + min_duration)

        if end_time > duration:
            end_time = duration
            start_time = max(0.0, min(start_time, end_time - min_duration))

        music_peak_time = min(max(music_peak_time, start_time), end_time)

        normalized.append(
            {
                "name": element_name,
                "type": element_type,
                "start_time": round(start_time, 3),
                "end_time": round(end_time, 3),
                "music_peak_time": round(music_peak_time, 3),
            }
        )
        cursor = round(end_time + 0.05, 3)
        if cursor >= duration:
            break

    return normalized


def _normalize_type(raw_type: str) -> str:
    lowered = raw_type.strip().lower()
    if lowered in DEFAULT_DURATIONS:
        return lowered
    if "jump" in lowered:
        return "jump"
    if "spin" in lowered:
        return "spin"
    if "turn" in lowered or "twizzle" in lowered or "mohawk" in lowered or "choctaw" in lowered:
        return "turns"
    if "sequence" in lowered:
        return "sequence"
    if "pose" in lowered:
        return "pose"
    return "transition"


def _target_density(duration: float) -> dict[str, int]:
    if duration < 110:
        return {"min_elements": 6, "max_elements": 9}
    if duration < 160:
        return {"min_elements": 8, "max_elements": 11}
    return {"min_elements": 10, "max_elements": 14}


def _build_openai_client(api_key: str | None):
    from openai import OpenAI  # type: ignore

    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required for ProgramPlanner.")
    return OpenAI(api_key=key)


def _responses_json(
    *,
    client: Any,
    model: str,
    input_items: list[dict[str, str]],
    schema_name: str,
    schema: dict[str, Any],
) -> dict[str, Any]:
    response = client.responses.create(
        model=model,
        input=input_items,
        store=False,
        text={
            "format": {
                "type": "json_schema",
                "name": schema_name,
                "schema": schema,
                "strict": True,
            }
        },
    )
    if not response.output_text:
        raise RuntimeError("OpenAI returned an empty response while planning the program.")
    return json.loads(response.output_text)
