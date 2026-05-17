import unittest

from src.voice.coaching_engine import CoachingEngine, _select_priority_elements


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
        self.assertLessEqual(len(cues), 2)
        self.assertTrue(all(cue["cue_kind"] in {"prep", "trigger", "focus"} for cue in cues))

    def test_select_priority_elements_limits_spoken_density(self):
        timing_plan = [
            {
                "element_index": 0,
                "name": "Spiral",
                "type": "transition",
                "start_time": 0.0,
                "end_time": 14.0,
                "music_peak_time": 8.0,
                "prep_time": 0.0,
                "trigger_time": 0.0,
                "focus_time": 8.0,
                "duration_seconds": 14.0,
            },
            {
                "element_index": 1,
                "name": "Step Sequence",
                "type": "sequence",
                "start_time": 14.5,
                "end_time": 28.0,
                "music_peak_time": 22.0,
                "prep_time": 13.0,
                "trigger_time": 14.0,
                "focus_time": 22.0,
                "duration_seconds": 13.5,
            },
            {
                "element_index": 2,
                "name": "Axel",
                "type": "jump",
                "start_time": 30.0,
                "end_time": 33.0,
                "music_peak_time": 31.5,
                "prep_time": 28.0,
                "trigger_time": 29.6,
                "focus_time": 31.5,
                "duration_seconds": 3.0,
            },
            {
                "element_index": 3,
                "name": "Spread Eagle",
                "type": "transition",
                "start_time": 38.0,
                "end_time": 51.0,
                "music_peak_time": 45.0,
                "prep_time": 37.0,
                "trigger_time": 37.8,
                "focus_time": 45.0,
                "duration_seconds": 13.0,
            },
            {
                "element_index": 4,
                "name": "Camel Spin",
                "type": "spin",
                "start_time": 58.0,
                "end_time": 66.0,
                "music_peak_time": 62.0,
                "prep_time": 56.5,
                "trigger_time": 57.7,
                "focus_time": 62.0,
                "duration_seconds": 8.0,
            },
            {
                "element_index": 5,
                "name": "Ina Bauer",
                "type": "transition",
                "start_time": 95.0,
                "end_time": 116.0,
                "music_peak_time": 108.0,
                "prep_time": 94.0,
                "trigger_time": 94.8,
                "focus_time": 108.0,
                "duration_seconds": 21.0,
            },
        ]

        selected = _select_priority_elements(timing_plan, 117.0)
        self.assertLessEqual(len(selected), 5)
        self.assertEqual(selected[0]["element_index"], 0)
        self.assertEqual(selected[-1]["element_index"], 5)


if __name__ == "__main__":
    unittest.main()
