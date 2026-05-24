"""OpenAI-based planned element generator for SkateSync AI."""

from __future__ import annotations

import json
import os
from typing import Any

from .knowledge import build_catalog_overview


DEFAULT_PLANNER_MODEL = os.getenv("SKATESYNC_PLANNER_MODEL", "gpt-4o-mini")

PLANNER_ALLOWED_MOVEMENTS = {
    "jump": ["Axel", "Salchow", "Loop", "Toe Loop", "Flip", "Lutz"],
    "spin": [
        "Upright Spin",
        "Scratch Spin",
        "Layback Spin",
        "Biellmann Spin",
        "Sit Spin",
        "Camel Spin",
        "Flying Spins",
    ],
    "turns": [
        "Three-Turn",
        "Bracket",
        "Rocker & Counter",
        "Mohawk & Choctaw",
        "Twizzle",
    ],
    "sequence": ["Step Sequence"],
    "transition": [
        "Spiral",
        "Spread Eagle",
        "Ina Bauer",
        "Lunge",
        "Cantilever",
        "One Foot Glide",
        "Two Foot Glide",
    ],
}

PLANNER_NAME_ALIASES = {
    "axel": "Axel",
    "salchow": "Salchow",
    "loop": "Loop",
    "rittberger": "Loop",
    "toe loop": "Toe Loop",
    "toeloop": "Toe Loop",
    "flip": "Flip",
    "lutz": "Lutz",
    "upright spin": "Upright Spin",
    "scratch spin": "Scratch Spin",
    "layback spin": "Layback Spin",
    "biellmann spin": "Biellmann Spin",
    "biellman spin": "Biellmann Spin",
    "sit spin": "Sit Spin",
    "camel spin": "Camel Spin",
    "flying spin": "Flying Spins",
    "flying spins": "Flying Spins",
    "three turn": "Three-Turn",
    "three-turn": "Three-Turn",
    "bracket": "Bracket",
    "rocker": "Rocker & Counter",
    "counter": "Rocker & Counter",
    "rocker and counter": "Rocker & Counter",
    "rocker ve counter": "Rocker & Counter",
    "mohawk": "Mohawk & Choctaw",
    "choctaw": "Mohawk & Choctaw",
    "mohawk and choctaw": "Mohawk & Choctaw",
    "mohawk ve choctaw": "Mohawk & Choctaw",
    "twizzle": "Twizzle",
    "step sequence": "Step Sequence",
    "spiral": "Spiral",
    "spread eagle": "Spread Eagle",
    "ina bauer": "Ina Bauer",
    "lunge": "Lunge",
    "cantilever": "Cantilever",
    "final pose": "Ina Bauer",
    "one foot glide": "One Foot Glide",
    "two foot glide": "Two Foot Glide",
}

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
    "jump": 3.0,
    "spin": 5.5,
    "turns": 5.0,
    "sequence": 7.5,
    "transition": 6.0,
}

SEGMENT_WEIGHTS = {
    "jump": 0.8,
    "spin": 1.0,
    "turns": 0.95,
    "sequence": 1.15,
    "transition": 0.95,
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
                    "uretmek. Ciktin yalnizca JSON schema'ya uymali. Sadece izin verilen hareket isimlerini, tam olarak "
                    "verildikleri yazimla kullan. Yeni hareket ismi uydurma; Final Pose, One Foot Glide veya Two Foot Glide "
                    "gibi izin verilmeyen isimleri asla kullanma. Liste tum parcaya yayilmali, ayni anda cakismaz sekilde "
                    "akmali ve muzik peak anlariyla mantikli sekilde eslesmeli."
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
                        "allowed_movements_by_type": PLANNER_ALLOWED_MOVEMENTS,
                        "planning_rules": {
                            "target_density": _target_density(duration),
                            "required_shape": [
                                "opening flow or transition block",
                                "at least one spin in the middle half",
                                "at least one rhythm-driven section or turns/sequence",
                                "a calm and expressive closing element from the allowed transition or spin names",
                            ],
                            "notes": [
                                "Use only movement names listed in allowed_movements_by_type.",
                                "Cover the full music duration from opening to closing.",
                                "Target medium-fast density, roughly one planned element every 6 to 8 seconds in a 2-minute program.",
                                "Do not stack jumps and spins back to back without a softer flow, turns, or sequence block between them.",
                                "Use transitions, turns, and sequences to connect major elements cleanly.",
                                "Jump windows should stay comparatively short.",
                                "The program should still feel skateable and connected, not random.",
                            ],
                        },
                    },
                    ensure_ascii=False,
                ),
            },
        ]
        density = _target_density(duration)

        payload = _responses_json(
            client=self.client,
            model=self.model,
            input_items=input_items,
            schema_name="planned_program",
            schema=PROGRAM_SCHEMA,
        )
        return normalize_planned_elements(
            payload.get("planned_elements", []),
            duration,
            target_density=density,
        )


def normalize_planned_elements(
    planned_elements: list[dict[str, Any]],
    duration: float,
    *,
    target_density: dict[str, int] | None = None,
) -> list[dict[str, Any]]:
    prepared: list[dict[str, Any]] = []
    density = dict(target_density or _target_density(duration))
    density.setdefault(
        "ideal_elements",
        max(
            density.get("min_elements", 5),
            min(
                density.get("max_elements", 7),
                round((density.get("min_elements", 5) + density.get("max_elements", 7)) / 2),
            ),
        ),
    )

    for raw in sorted(planned_elements, key=lambda item: float(item.get("start_time", 0.0))):
        element_type = _normalize_type(str(raw.get("type", "transition")))
        element_name = _normalize_allowed_name(str(raw.get("name", "")), element_type)
        prepared.append(
            {
                "name": element_name,
                "type": element_type,
                "start_time": float(raw.get("start_time", 0.0)),
                "end_time": float(raw.get("end_time", 0.0)),
                "music_peak_time": float(raw.get("music_peak_time", raw.get("start_time", 0.0))),
            }
        )

    prepared = _trim_element_count(prepared, density["max_elements"])

    if not prepared:
        prepared = _build_fallback_program(duration, density["ideal_elements"])

    blueprint = _build_macro_blueprint(
        duration,
        density["ideal_elements"],
        prepared,
    )
    shaped = _shape_program_to_blueprint(
        prepared,
        duration,
        blueprint,
    )

    if len(shaped) < density["min_elements"]:
        shaped = _shape_program_to_blueprint(
            _build_fallback_program(duration, density["ideal_elements"]),
            duration,
            _build_macro_blueprint(duration, density["min_elements"], prepared),
        )

    return shaped


def _normalize_timeline(
    prepared: list[dict[str, Any]],
    duration: float,
) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    cursor = 0.0

    for raw in prepared:
        element_type = str(raw["type"])
        element_name = str(raw["name"])

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


def _shape_program_to_blueprint(
    prepared: list[dict[str, Any]],
    duration: float,
    blueprint: list[str],
) -> list[dict[str, Any]]:
    if not blueprint:
        return _normalize_timeline(prepared, duration)

    pools: dict[str, list[str]] = {}
    for element in prepared:
        pools.setdefault(str(element["type"]), []).append(str(element["name"]))

    inter_element_gap = 0.25
    total_gap = inter_element_gap * max(0, len(blueprint) - 1)
    usable_duration = max(duration - total_gap, float(len(blueprint)))
    total_weight = sum(SEGMENT_WEIGHTS[element_type] for element_type in blueprint)
    unit = usable_duration / max(total_weight, 1.0)

    timeline: list[dict[str, Any]] = []
    cursor = 0.0
    previous_name = ""

    for index, element_type in enumerate(blueprint):
        allocated = max(DEFAULT_DURATIONS[element_type], unit * SEGMENT_WEIGHTS[element_type])
        if index == len(blueprint) - 1:
            end_time = duration
        else:
            end_time = min(duration, cursor + allocated)
        if end_time <= cursor:
            end_time = min(duration, cursor + DEFAULT_DURATIONS[element_type])

        name = _next_name_for_type(
            pools,
            element_type,
            previous_name=previous_name,
            force_closing=(index == len(blueprint) - 1),
        )
        peak_ratio = 0.56 if element_type == "jump" else 0.62
        peak_time = min(end_time, cursor + ((end_time - cursor) * peak_ratio))
        timeline.append(
            {
                "name": name,
                "type": element_type,
                "start_time": round(cursor, 3),
                "end_time": round(end_time, 3),
                "music_peak_time": round(peak_time, 3),
            }
        )
        previous_name = name
        cursor = min(duration, round(end_time + inter_element_gap, 3))
        if cursor >= duration:
            break

    return _normalize_timeline(timeline, duration)


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
    return "transition"


def _normalize_allowed_name(raw_name: str, element_type: str) -> str:
    stripped = " ".join(raw_name.strip().split())
    if not stripped:
        return _fallback_allowed_name(element_type)

    canonical = PLANNER_NAME_ALIASES.get(stripped.casefold())
    if canonical:
        return canonical

    allowed_names = PLANNER_ALLOWED_MOVEMENTS.get(element_type, [])
    if stripped in allowed_names:
        return stripped

    lowered = stripped.casefold()
    for candidate in allowed_names:
        if candidate.casefold() == lowered:
            return candidate

    return _fallback_allowed_name(element_type)


def _fallback_allowed_name(element_type: str) -> str:
    allowed_names = PLANNER_ALLOWED_MOVEMENTS.get(element_type)
    if not allowed_names:
        return "Step Sequence"
    if element_type == "spin":
        return "Camel Spin"
    if element_type == "jump":
        return "Salchow"
    if element_type == "turns":
        return "Three-Turn"
    if element_type == "transition":
        return "Spiral"
    return allowed_names[0]


def _trim_element_count(
    prepared: list[dict[str, Any]],
    max_elements: int,
) -> list[dict[str, Any]]:
    if len(prepared) <= max_elements or max_elements <= 0:
        return prepared
    if max_elements == 1:
        return [prepared[0]]

    step = (len(prepared) - 1) / float(max_elements - 1)
    selected_indexes = sorted({round(index * step) for index in range(max_elements)})
    return [prepared[index] for index in selected_indexes]


def _build_fallback_program(duration: float, element_count: int) -> list[dict[str, Any]]:
    pattern = [
        ("transition", "Spiral"),
        ("turns", "Three-Turn"),
        ("jump", "Salchow"),
        ("transition", "Spread Eagle"),
        ("spin", "Camel Spin"),
        ("turns", "Twizzle"),
        ("sequence", "Step Sequence"),
        ("jump", "Loop"),
        ("transition", "Lunge"),
        ("spin", "Sit Spin"),
        ("turns", "Bracket"),
        ("jump", "Flip"),
        ("transition", "Ina Bauer"),
        ("spin", "Layback Spin"),
    ]

    safe_count = max(1, element_count)
    slot_length = max(duration / safe_count, 4.5)
    plan: list[dict[str, Any]] = []

    for index in range(safe_count):
        element_type, name = pattern[index % len(pattern)]
        start_time = index * slot_length
        end_time = min(duration, start_time + slot_length - 0.1)
        peak_time = min(end_time, start_time + (slot_length * 0.6))
        plan.append(
            {
                "name": name,
                "type": element_type,
                "start_time": start_time,
                "end_time": end_time,
                "music_peak_time": peak_time,
            }
        )

    return plan


def _build_macro_blueprint(
    duration: float,
    ideal_elements: int,
    prepared: list[dict[str, Any]],
) -> list[str]:
    if ideal_elements <= 6:
        return ["transition", "turns", "jump", "transition", "spin", "transition"]

    cycle = [
        "turns",
        "jump",
        "transition",
        "spin",
        "transition",
        "sequence",
        "transition",
        "jump",
        "turns",
        "spin",
        "transition",
    ]
    blueprint = ["transition"]
    cycle_index = 0
    while len(blueprint) < max(ideal_elements - 1, 1):
        blueprint.append(cycle[cycle_index % len(cycle)])
        cycle_index += 1
    blueprint = blueprint[: max(ideal_elements - 1, 1)]
    blueprint.append("transition")
    return blueprint


def _next_name_for_type(
    pools: dict[str, list[str]],
    element_type: str,
    *,
    previous_name: str,
    force_closing: bool,
) -> str:
    if force_closing and element_type == "transition":
        for closing_name in ("Ina Bauer", "Spread Eagle", "Spiral"):
            if closing_name in PLANNER_ALLOWED_MOVEMENTS["transition"] and closing_name != previous_name:
                return closing_name

    candidates = pools.get(element_type, [])
    while candidates:
        candidate = candidates.pop(0)
        if candidate != previous_name:
            return candidate
    return _fallback_allowed_name(element_type)


def _target_density(duration: float) -> dict[str, int]:
    if duration < 90:
        return {"min_elements": 9, "max_elements": 12, "ideal_elements": 10}
    if duration < 145:
        return {"min_elements": 12, "max_elements": 16, "ideal_elements": 14}
    return {"min_elements": 14, "max_elements": 18, "ideal_elements": 16}


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
