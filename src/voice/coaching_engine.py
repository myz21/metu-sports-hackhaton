import json
import os
from dataclasses import dataclass
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

load_dotenv()

DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"


class CueModel(BaseModel):
    time: float = Field(..., ge=0)
    text: str = Field(..., min_length=1, max_length=80)


class CueListModel(BaseModel):
    cues: list[CueModel]


@dataclass
class TimingPlan:
    action: str
    target_time: float
    prep_time: float
    trigger_time: float
    prep_beat: float
    trigger_beat: float


class CoachingEngine:
    def __init__(
        self,
        audio_data: dict[str, Any],
        planned_program: list[dict[str, Any]] | None = None,
        gemini_api_key: str | None = None,
        model: str = DEFAULT_GEMINI_MODEL,
        reaction_lead_seconds: float = 0.35,
        prep_lead_seconds: float = 2.0,
    ):
        self.audio_data = audio_data
        self.planned_program = planned_program or []
        self.model = model
        self.reaction_lead_seconds = reaction_lead_seconds
        self.prep_lead_seconds = prep_lead_seconds
        self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.gemini_api_key)

    def _nearest_beat(self, target_time: float) -> float:
        beat_times = self.audio_data.get("beat_times") or []
        if not beat_times:
            return round(target_time, 3)
        return float(min(beat_times, key=lambda beat: abs(beat - target_time)))

    def _build_timing_plan(self) -> list[TimingPlan]:
        timing_plan: list[TimingPlan] = []
        duration = float(self.audio_data.get("duration", 0))
        for item in self.planned_program:
            action = str(item["action"]).strip()
            raw_target_time = max(0.0, min(float(item["time"]), duration))
            
            # 1. HİBRİT ADIMI ZORUNLU KIL: Hedef zamanı en yakın Librosa vuruşuna (beat) mıknatısla
            target_time = self._nearest_beat(raw_target_time)
            
            prep_anchor = max(0.0, target_time - self.prep_lead_seconds)
            trigger_anchor = max(0.0, target_time - self.reaction_lead_seconds)
            prep_beat = self._nearest_beat(prep_anchor)
            trigger_beat = self._nearest_beat(trigger_anchor)
            timing_plan.append(
                TimingPlan(
                    action=action,
                    target_time=round(target_time, 3),
                    prep_time=round(prep_anchor, 3),
                    trigger_time=round(trigger_anchor, 3),
                    prep_beat=round(prep_beat, 3),
                    trigger_beat=round(trigger_beat, 3),
                )
            )
        return timing_plan

    def _build_prompt(self, timing_plan: list[TimingPlan]) -> tuple[str, str]:
        system_prompt = (
            "Sen artistik buz pateni ve tekerlekli paten sporculari icin dunya capinda "
            "bir koreografi ve sesli kocluk asistanisin. Gorevin, sana verilen muzik "
            "ritim verilerine ve planlanan hareket zamanlarina bakarak, sporcuya "
            "kulakliktan gercek zamanli fisildayacak bir kocluk senaryosu uretmektir. "
            "Sporcunun odagini dagitmamak icin cumleler cok kisa, dogal ve muzigin "
            "ruhuna uygun olmali. Hazirlik uyarilari en fazla 4 kelime olmali. "
            "Tetikleyici komutlar tek kelime ya da en fazla 2 cok kisa kelime olmali. "
            "Periyodik metronom tekrarlarindan kacin. Sana verilen zamanlar latency ve "
            "biyomekanik reaksiyon icin onceden telafi edilmis zamanlardir; bunlari "
            "degistirme. Ciktini kesinlikle yalnizca JSON olarak ver."
        )

        payload = {
            "timing_rules": {
                "prep_lead_seconds": self.prep_lead_seconds,
                "reaction_lead_seconds": self.reaction_lead_seconds,
                "timing_note": (
                    "prep_beat ve trigger_beat degerleri kullanilacak kesin cue "
                    "zamanlaridir; target_time sadece sporcu hareket hedefidir."
                ),
            },
            "audio_context": {
                "tempo_bpm": round(float(self.audio_data.get("tempo", 0)), 2),
                "duration_seconds": round(float(self.audio_data.get("duration", 0)), 2),
                "energy_profile": self.audio_data.get("energy_profile", []),
                "first_beats": [round(float(b), 3) for b in self.audio_data.get("beat_times", [])[:24]],
            },
            "planned_program": [
                {
                    "action": plan.action,
                    "target_time": plan.target_time,
                    "prep_time": plan.prep_time,
                    "prep_beat": plan.prep_beat,
                    "trigger_time": plan.trigger_time,
                    "trigger_beat": plan.trigger_beat,
                }
                for plan in timing_plan
            ],
            "requirements": [
                "Her hareket icin tam 1 hazirlik ve 1 tetikleyici cue uret.",
                "Hazirlik cue zamani prep_beat olmali.",
                "Tetikleyici cue zamani trigger_beat olmali.",
                "Hazirlik cue metni dogal Turkce ve kisa olmali.",
                "Tetikleyici cue metni cok kisa olmali ve sporcuyu anlik tetiklemeli.",
                "Gerekirse en fazla 2 ek motivasyon cue'u ekleyebilirsin; bunlar ritmik tekrar gibi duyulmamali.",
                "JSON formati: {\"cues\": [{\"time\": float, \"text\": string}, ...]}",
            ],
        }
        return system_prompt, json.dumps(payload, ensure_ascii=False, indent=2)

    def _normalize_response(self, response_text: str) -> list[dict[str, Any]]:
        parsed = CueListModel.model_validate(json.loads(response_text))
        cues = [
            {
                "time": round(float(cue.time), 3),
                "text": cue.text.strip(),
            }
            for cue in parsed.cues
            if cue.text.strip()
        ]
        cues.sort(key=lambda cue: cue["time"])
        return cues

    def generate_cues(self) -> list[dict[str, Any]]:
        timing_plan = self._build_timing_plan()
        system_prompt, user_prompt = self._build_prompt(timing_plan)

        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.5,
                        response_mime_type="application/json",
                        response_schema={
                            "type": "object",
                            "properties": {
                                "cues": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "time": {"type": "number"},
                                            "text": {"type": "string"},
                                        },
                                        "required": ["time", "text"],
                                    },
                                }
                            },
                            "required": ["cues"],
                        },
                        system_instruction=system_prompt,
                        max_output_tokens=4096,
                    ),
                )
                
                response_text = response.text.strip()
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.startswith("```"):
                    response_text = response_text[3:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                response_text = response_text.strip()
                
                return self._normalize_response(response_text)
            except Exception as e:
                print(f"CoachingEngine Attempt {attempt+1} failed: {e}")
                if attempt == 2:
                    raise e
        return []


if __name__ == "__main__":
    dummy_audio = {
        "tempo": 120,
        "beat_times": [0.5, 2, 4, 6, 8, 10, 12, 14],
        "duration": 15,
        "energy_profile": [0.2, 0.4, 0.7, 0.3],
    }
    dummy_program = [{"time": 10, "action": "Axel Jump"}]

    engine = CoachingEngine(dummy_audio, dummy_program)
    for cue in engine.generate_cues():
        print(f"[{cue['time']:.2f}s] {cue['text']}")
