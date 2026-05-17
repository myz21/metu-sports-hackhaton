import unittest

from src.voice.coaching_engine import CoachingEngine


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
            client={},
        )
        timing_plan = engine.build_timing_plan()
        self.assertEqual(timing_plan[0]["prep_time"], 0.5)
        self.assertEqual(timing_plan[0]["trigger_time"], 2.0)

    def test_generate_cues_uses_movement_callouts_and_spin_count(self):
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
                    "end_time": 8.4,
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
            client={},
        )
        cues = engine.generate_cues()
        self.assertEqual(len(cues), 3)
        self.assertEqual(cues[0]["text"], "Sit Spin")
        self.assertEqual(cues[1]["cue_kind"], "count")
        self.assertIn("spin", cues[1]["text"].lower())
        self.assertEqual(cues[2]["text"], "Axel")

    def test_generate_cues_skips_only_when_elements_are_too_close(self):
        engine = CoachingEngine(
            audio_data={
                "tempo": 120,
                "duration": 25,
                "beat_times": [1.0, 2.0, 4.0, 8.0, 12.0, 16.0, 20.0],
            },
            planned_elements=[
                {
                    "name": "Spiral",
                    "type": "transition",
                    "start_time": 4.0,
                    "end_time": 7.0,
                    "music_peak_time": 5.5,
                },
                {
                    "name": "Three-Turn",
                    "type": "turns",
                    "start_time": 8.0,
                    "end_time": 11.0,
                    "music_peak_time": 9.0,
                },
                {
                    "name": "Loop",
                    "type": "jump",
                    "start_time": 16.0,
                    "end_time": 18.0,
                    "music_peak_time": 17.0,
                },
            ],
            client={},
        )
        cues = engine.generate_cues()
        self.assertEqual([cue["text"] for cue in cues], ["Spiral", "Three-Turn", "Loop"])


if __name__ == "__main__":
    unittest.main()
