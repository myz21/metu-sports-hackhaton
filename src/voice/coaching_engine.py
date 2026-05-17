"""OpenAI-based short-form coaching cue generation for planned elements."""

from __future__ import annotations

import json
import os
from typing import Any

from .knowledge import build_rag_context


DEFAULT_COACH_MODEL = os.getenv("SKATESYNC_COACH_MODEL", "gpt-4o-mini")

PREP_LEADS = {
    "jump": 2.0,
    "spin": 1.5,
    "turns": 1.1,
    "sequence": 1.4,
    "transition": 0.9,
    "pose": 0.7,
}

TRIGGER_LEADS = {
    "jump": 0.42,
    "spin": 0.24,
    "turns": 0.18,
    "sequence": 0.24,
    "transition": 0.15,
    "pose": 0.1,
}

PRIMARY_CUE_SPACING_SECONDS = 7.5

CUE_TEXT_SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "element_index": {"type": "integer"},
                    "prep_text": {"type": "string"},
                    "trigger_text": {"type": "string"},
                    "focus_text": {"type": "string"},
                },
                "required": [
                    "element_index",
                    "prep_text",
                    "trigger_text",
                    "focus_text",
                ],
                "additionalProperties": False,
            },
        }
    },
    "required": ["items"],
    "additionalProperties": False,
}


class CoachingEngine:
    def __init__(
        self,
        audio_data: dict[str, Any],
        planned_elements: list[dict[str, Any]],
        *,
        api_key: str | None = None,
        model: str = DEFAULT_COACH_MODEL,
        language: str = "Turkish",
        knowledge_path: str | None = None,
        client: Any | None = None,
    ):
        self.audio_data = audio_data
        self.planned_elements = planned_elements
        self.model = model
        self.language = language
        self.knowledge_path = knowledge_path
        self.client = client or _build_openai_client(api_key)

    def build_timing_plan(self) -> list[dict[str, Any]]:
        beat_times = [float(item) for item in self.audio_data.get("beat_times", [])]
        duration = float(self.audio_data.get("duration", 0))
        timing_plan: list[dict[str, Any]] = []

        for index, element in enumerate(self.planned_elements):
            element_type = str(element["type"]).lower()
            start_time = max(0.0, min(float(element["start_time"]), duration))
            end_time = max(start_time, min(float(element["end_time"]), duration))
            peak_time = max(start_time, min(float(element["music_peak_time"]), end_time))

            prep_anchor = max(0.0, start_time - PREP_LEADS.get(element_type, 1.0))
            trigger_anchor = max(0.0, start_time - TRIGGER_LEADS.get(element_type, 0.2))
            focus_anchor = peak_time

            prep_time = _snap_to_nearest_beat(prep_anchor, beat_times)
            trigger_time = _snap_to_nearest_beat(trigger_anchor, beat_times)
            focus_time = _snap_to_nearest_beat(focus_anchor, beat_times)

            rag_context = build_rag_context(
                movement_name=str(element["name"]),
                movement_type=element_type,
                top_k=2,
                knowledge_path=self.knowledge_path,
            )

            timing_plan.append(
                {
                    "element_index": index,
                    "name": element["name"],
                    "type": element_type,
                    "start_time": round(start_time, 3),
                    "end_time": round(end_time, 3),
                    "music_peak_time": round(peak_time, 3),
                    "prep_time": round(prep_time, 3),
                    "trigger_time": round(trigger_time, 3),
                    "focus_time": round(focus_time, 3),
                    "duration_seconds": round(end_time - start_time, 3),
                    "movement_context": rag_context["prompt_context"],
                }
            )

        return timing_plan

    def generate_cues(self) -> list[dict[str, Any]]:
        timing_plan = self.build_timing_plan()
        selected_plans = _select_priority_elements(
            timing_plan,
            float(self.audio_data.get("duration", 0)),
        )
        input_items = [
            {
                "role": "system",
                "content": (
                    "Sen artistik buz pateni ve artistik roller skating icin deneyimli bir sesli kocsun. "
                    "Gorevin, sana verilen hareket timeline'ina gore cok kisa ama gercekci kulaklik cue'lari uretmek. "
                    "Bu sistem her hareketi seslendirmez; sadece secilmis onemli anlar konusulur. "
                    "Dil dogal, teknik ve sporcuyu rahatsiz etmeyecek kadar kisa olmali. "
                    "Prep cue'lar 2-4 kelime olmali. Trigger cue'lar 1-3 kelime olmali. "
                    "Ayni ifadeyi surekli tekrar etme. Tek basina 'Basla', 'Don' veya 'Atla' gibi bos ve jenerik komutlara kacma. "
                    "Mumkun oldugunca hat, merkez, ritim, kenar, akis veya cikis gibi daha anlamli kelimeler sec. "
                    "Hakem gibi konusma; antrenor gibi yonlendir."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "language": self.language,
                        "tempo_bpm": round(float(self.audio_data.get("tempo", 0)), 2),
                        "planned_elements": selected_plans,
                        "requirements": [
                            "Yalnizca verilen secili elementler icin metin uret.",
                            "Her element icin tam 1 prep_text ve 1 trigger_text uret.",
                            "focus_text yalnizca hareket 4 saniyeden uzunsa ve ek teknik hatirlatma gercekten gerekliyse dolu olsun; yoksa bos string kullan.",
                            "Metinler teknik olarak hareketin karakterine uysun.",
                            "Metinler sporcu kulakliktan duyacakmis gibi akici olsun.",
                        ],
                    },
                    ensure_ascii=False,
                ),
            },
        ]

        payload = _responses_json(
            client=self.client,
            model=self.model,
            input_items=input_items,
            schema_name="coaching_cue_texts",
            schema=CUE_TEXT_SCHEMA,
        )
        generated_items = {
            int(item["element_index"]): item for item in payload.get("items", [])
        }

        cues: list[dict[str, Any]] = []
        last_primary_time = -999.0
        for plan in selected_plans:
            generated = generated_items.get(plan["element_index"], {})
            prep_text = _normalize_short_text(
                generated.get("prep_text"),
                fallback=_fallback_prep_text(plan["type"], plan["name"]),
            )
            trigger_text = _normalize_short_text(
                generated.get("trigger_text"),
                fallback=_fallback_trigger_text(plan["type"], plan["name"]),
            )
            focus_text = _normalize_short_text(generated.get("focus_text"), fallback="", max_words=5)
            cue_kind, cue_time, cue_text = _build_primary_cue(
                plan,
                prep_text,
                trigger_text,
                focus_text,
            )
            if cue_time - last_primary_time < PRIMARY_CUE_SPACING_SECONDS:
                cue_kind, cue_time, cue_text = _build_primary_cue(
                    plan,
                    prep_text,
                    trigger_text,
                    focus_text,
                    prefer_trigger=True,
                )
            if cue_time - last_primary_time < PRIMARY_CUE_SPACING_SECONDS:
                continue

            cues.append(
                {
                    "element_index": plan["element_index"],
                    "element_name": plan["name"],
                    "element_type": plan["type"],
                    "cue_kind": cue_kind,
                    "time": cue_time,
                    "text": cue_text,
                }
            )
            last_primary_time = float(cue_time)

        cues.sort(key=lambda item: (float(item["time"]), int(item["element_index"])))
        return cues


def _snap_to_nearest_beat(
    target_time: float,
    beat_times: list[float],
    *,
    max_shift_seconds: float = 0.4,
) -> float:
    if not beat_times:
        return round(target_time, 3)
    nearest = min(beat_times, key=lambda beat: abs(beat - target_time))
    if abs(nearest - target_time) <= max_shift_seconds:
        return round(nearest, 3)
    return round(target_time, 3)


def _normalize_short_text(
    value: Any,
    *,
    fallback: str,
    max_words: int = 4,
) -> str:
    text = " ".join(str(value or "").strip().split())
    if not text:
        return fallback
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words])
    return text


def _select_priority_elements(
    timing_plan: list[dict[str, Any]],
    duration: float,
) -> list[dict[str, Any]]:
    if not timing_plan:
        return []

    if duration < 95:
        max_spoken_elements = 4
    elif duration < 145:
        max_spoken_elements = 5
    else:
        max_spoken_elements = 6

    scored: list[tuple[float, dict[str, Any]]] = []
    for position, plan in enumerate(timing_plan):
        element_type = str(plan["type"])
        base_scores = {
            "jump": 5.0,
            "spin": 4.5,
            "sequence": 3.5,
            "turns": 3.0,
            "transition": 2.5,
            "pose": 2.0,
        }
        score = base_scores.get(element_type, 2.0)
        score += min(float(plan["duration_seconds"]) / 6.0, 1.5)
        if position == 0:
            score += 1.0
        if position == len(timing_plan) - 1:
            score += 1.4
        if plan["start_time"] >= duration * 0.65 and element_type in {"spin", "transition"}:
            score += 0.7
        scored.append((score, plan))

    protected_indexes = {0, len(timing_plan) - 1}
    selected: list[dict[str, Any]] = [
        plan for plan in timing_plan if int(plan["element_index"]) in protected_indexes
    ]

    for _, plan in sorted(scored, key=lambda item: item[0], reverse=True):
        if len(selected) >= max_spoken_elements:
            break
        if any(int(item["element_index"]) == int(plan["element_index"]) for item in selected):
            continue
        if any(abs(float(plan["start_time"]) - float(item["start_time"])) < 10.0 for item in selected):
            continue
        selected.append(plan)

    selected.sort(key=lambda item: float(item["start_time"]))
    return selected


def _build_primary_cue(
    plan: dict[str, Any],
    prep_text: str,
    trigger_text: str,
    focus_text: str,
    *,
    prefer_trigger: bool = False,
) -> tuple[str, float, str]:
    element_type = str(plan["type"])
    if element_type == "jump" and not prefer_trigger:
        return "prep", float(plan["prep_time"]), prep_text or trigger_text
    if element_type == "spin" and not prefer_trigger:
        return "prep", float(plan["prep_time"]), prep_text or focus_text or trigger_text
    if element_type in {"sequence", "transition", "turns"} and focus_text and float(plan["duration_seconds"]) >= 8.0:
        return "focus", float(plan["focus_time"]), focus_text
    return "trigger", float(plan["trigger_time"]), trigger_text or prep_text


def _fallback_prep_text(element_type: str, element_name: str) -> str:
    if element_type == "jump":
        return "Ritmi topla"
    if element_type == "spin":
        return "Merkezi hisset"
    if element_type == "sequence":
        return "Ritmi tasi"
    if element_type == "turns":
        return "Kenari hazirla"
    if element_type == "pose":
        return "Finali kur"
    return "Hatti uzat"


def _fallback_trigger_text(element_type: str, element_name: str) -> str:
    if element_type == "jump":
        return "Temiz cik"
    if element_type == "spin":
        return "Merkezi koru"
    if element_type == "sequence":
        return "Ritmi islet"
    if element_type == "turns":
        return "Kenari cevir"
    if element_type == "pose":
        return "Tut"
    return "Akisi ac"


def _build_openai_client(api_key: str | None):
    from openai import OpenAI  # type: ignore

    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required for CoachingEngine.")
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
        raise RuntimeError("OpenAI returned an empty response while generating coaching cues.")
    return json.loads(response.output_text)
