import json
import os
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

load_dotenv()

DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"

class ActionModel(BaseModel):
    time: float = Field(..., ge=0)
    action: str = Field(..., min_length=1, max_length=100)

class ProgramModel(BaseModel):
    program: list[ActionModel]

class ProgramPlanner:
    def __init__(
        self,
        audio_data: dict[str, Any],
        gemini_api_key: str | None = None,
        model: str = DEFAULT_GEMINI_MODEL,
    ):
        self.audio_data = audio_data
        self.model = model
        self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.gemini_api_key)

    def generate_program(self) -> list[dict[str, Any]]:
        duration = round(float(self.audio_data.get("duration", 0)), 2)
        energy_profile = self.audio_data.get("energy_profile", [])
        
        # Sadece enerji profilini özlü göstermek için
        sampled_energy = [round(e, 3) for e in energy_profile] if energy_profile else []
        
        system_prompt = (
            "Sen uluslararası artistik buz pateni ve tekerlekli paten şampiyonaları için "
            "profesyonel bir koreografsın. Görevin, verilen müziğin toplam süresini ve enerji profilini "
            "dikkate alarak dolu dolu ve kurallara uygun bir yarışma koreografisi oluşturmaktır. "
            "Sistemin oluşturduğu çıktı, doğrudan zamanlanmış JSON formatında olmalıdır. "
            "En az 10 ile 15 arasında farklı hareket (Dönüşler, Atlayışlar, Adım Dizileri, vs.) içermelidir."
        )

        user_prompt = f"""
Sana {duration} saniyelik bir müziğin enerji profilini (hangi saniyelerde yükseldiğini) veriyorum. 
Müziğin Enerji Profili: {sampled_energy}

Bana yarışma kurallarına uygun, yoğun ve eksiksiz bir artistik paten koreografisi listesi çıkar (en az 10-15 hareket). 
Dönüşler, atlayışlar, adım dizileri (step sequences) ve koreografik geçişleri içersin. 
Tüm hareketleri {duration} saniyelik süreye mantıklı aralıklarla yay. Enerjinin yüksek olduğu yerlere atlayış (Jump) koymayı düşünebilirsin.
"""

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
                                "program": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "time": {"type": "number"},
                                            "action": {"type": "string"},
                                        },
                                        "required": ["time", "action"],
                                    },
                                }
                            },
                            "required": ["program"],
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
                
                parsed = ProgramModel.model_validate(json.loads(response_text))
                program = [
                    {
                        "time": max(0.0, min(round(float(item.time), 3), duration)),
                        "action": item.action.strip(),
                    }
                    for item in parsed.program
                    if item.action.strip()
                ]
                program.sort(key=lambda item: item["time"])
                return program
            except Exception as e:
                print(f"Attempt {attempt+1} failed: {e}")
                if attempt == 2:
                    raise e
        return []

if __name__ == "__main__":
    dummy_audio = {
        "duration": 220,
        "energy_profile": [0.1, 0.2, 0.8, 0.9, 0.3, 0.4, 0.7, 0.1],
    }
    planner = ProgramPlanner(dummy_audio)
    for p in planner.generate_program():
        print(f"[{p['time']:.2f}s] {p['action']}")
