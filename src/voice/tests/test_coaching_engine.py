import unittest

from src.voice.coaching_engine import CoachingEngine


class DummyResponses:
    def create(self, **kwargs):
        class Response:
            output_text = (
                '{"items": ['
                '{"element_index": 0, "prep_text": "Merkezi kur", "trigger_text": "Don", "focus_text": "Hatti tut"},'
                '{"element_index": 1, "prep_text": "Kalkisa hazirlan", "trigger_text": "Atla", "focus_text": ""}'
                "]}"
            )

        return Response()


class DummyClient:
    responses = DummyResponses()


class CoachingEngineTests(unittest.TestCase):
    def test_build_timing_plan_snaps_to_beats(self):
        engine = CoachingEngine(
            audio_data={
                "tempo": 120,
                "duration": 20,
                "beat_times": [0.5, 1.0, 1.5, 2.0, 3.5, 4.0, 5.0],
            },
            planned_elements=[
                {
                    "name": "Sit Spin",
                    "type": "spin",
                    "start_time": 2.2,
                    "end_time": 6.8,
                    "music_peak_time": 4.1,
                }
            ],
            client=DummyClient(),
        )
        timing_plan = engine.build_timing_plan()
        self.assertEqual(timing_plan[0]["prep_time"], 0.5)
        self.assertEqual(timing_plan[0]["trigger_time"], 2.0)

    def test_generate_cues_creates_focus_for_long_spin(self):
        engine = CoachingEngine(
            audio_data={
                "tempo": 120,
                "duration": 20,
                "beat_times": [0.5, 1.0, 1.5, 2.0, 3.5, 4.0, 5.0, 6.0],
            },
            planned_elements=[
                {
                    "name": "Sit Spin",
                    "type": "spin",
                    "start_time": 2.2,
                    "end_time": 6.8,
                    "music_peak_time": 4.1,
                },
                {
                    "name": "Axel",
                    "type": "jump",
                    "start_time": 8.0,
                    "end_time": 9.3,
                    "music_peak_time": 8.6,
                },
            ],
            client=DummyClient(),
        )
        cues = engine.generate_cues()
        self.assertEqual(len(cues), 5)
        self.assertTrue(any(cue["cue_kind"] == "focus" for cue in cues))


if __name__ == "__main__":
    unittest.main()
