"""OpenAI-based short-form coaching cue generation for planned elements."""

from __future__ import annotations

import os
from typing import Any


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
        self.client = client

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
                }
            )

        return timing_plan

    def generate_cues(self) -> list[dict[str, Any]]:
        timing_plan = self.build_timing_plan()
        cues: list[dict[str, Any]] = []
        for plan in timing_plan:
            trigger_text = _movement_callout(str(plan["name"]), str(plan["type"]))
            cue_time = float(plan["trigger_time"])

            cues.append(
                {
                    "element_index": plan["element_index"],
                    "element_name": plan["name"],
                    "element_type": plan["type"],
                    "cue_kind": "trigger",
                    "time": round(cue_time, 3),
                    "text": trigger_text,
                }
            )

            if str(plan["type"]) == "spin" and float(plan["duration_seconds"]) >= 5.5:
                focus_time = float(plan["focus_time"])
                if focus_time - cue_time >= 1.8:
                    cues.append(
                        {
                            "element_index": plan["element_index"],
                            "element_name": plan["name"],
                            "element_type": plan["type"],
                            "cue_kind": "count",
                            "time": round(focus_time, 3),
                            "text": _spin_count_callout(str(plan["name"])),
                        }
                    )

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


def _movement_callout(element_name: str, element_type: str) -> str:
    callout_map = {
        "Axel": "Bir iki üç, aksel",
        "Salchow": "Bir iki üç, salchow",
        "Loop": "Bir iki üç, loop",
        "Toe Loop": "Bir iki üç, toe loop",
        "Flip": "Bir iki üç, flip",
        "Lutz": "Bir iki üç, lutz",
        "Upright Spin": "Upright spin, merkezi koru",
        "Scratch Spin": "Scratch spin, hızlan",
        "Layback Spin": "Layback spin, açıl",
        "Biellmann Spin": "Biellmann spin, yukarı çek",
        "Sit Spin": "Sit spin, aşağıda kal",
        "Camel Spin": "Camel spin, hattı uzat",
        "Flying Spins": "Flying spin, merkeze otur",
        "Three-Turn": "Three turn, çevir",
        "Bracket": "Bracket, kenarı koru",
        "Rocker & Counter": "Rocker counter, ritmi taşı",
        "Mohawk & Choctaw": "Mohawk choctaw, geçişi temizle",
        "Twizzle": "Twizzle, merkezde kal",
        "Step Sequence": "Step sequence, ritmi taşı",
        "Spiral": "Spiral, çizgiyi uzat",
        "Spread Eagle": "Spread eagle, açıl",
        "Ina Bauer": "Ina Bauer, açıl",
        "Lunge": "Lunge, derine in",
        "Cantilever": "Cantilever, hattı koru",
        "One Foot Glide": "One foot glide, dengeyi koru",
        "Two Foot Glide": "Two foot glide, akışı koru",
    }
    return callout_map.get(element_name, _spoken_movement_name(element_name))


def _spin_count_callout(element_name: str) -> str:
    return f"Bir iki üç, {_spoken_movement_name(element_name)}"


def _spoken_movement_name(element_name: str) -> str:
    name = element_name.strip()
    spoken_map = {
        "Axel": "aksel",
        "Salchow": "salchow",
        "Loop": "loop",
        "Toe Loop": "toe loop",
        "Flip": "flip",
        "Lutz": "lutz",
        "Upright Spin": "upright spin",
        "Scratch Spin": "scratch spin",
        "Layback Spin": "layback spin",
        "Biellmann Spin": "biellmann spin",
        "Sit Spin": "sit spin",
        "Camel Spin": "camel spin",
        "Flying Spins": "flying spin",
        "Three-Turn": "three turn",
        "Bracket": "bracket",
        "Rocker & Counter": "rocker counter",
        "Mohawk & Choctaw": "mohawk choctaw",
        "Twizzle": "twizzle",
        "Step Sequence": "step sequence",
        "Spiral": "spiral",
        "Spread Eagle": "spread eagle",
        "Ina Bauer": "ina bauer",
        "Lunge": "lunge",
        "Cantilever": "cantilever",
        "One Foot Glide": "one foot glide",
        "Two Foot Glide": "two foot glide",
    }
    return spoken_map.get(name, name.replace("&", "").lower())


def _build_openai_client(api_key: str | None):
    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required for CoachingEngine.")
    return {"api_key_present": True}
