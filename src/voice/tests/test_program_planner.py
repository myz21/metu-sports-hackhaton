import unittest

from src.voice.program_planner import PLANNER_ALLOWED_MOVEMENTS, normalize_planned_elements


class ProgramPlannerNormalizationTests(unittest.TestCase):
    def test_normalize_planned_elements_rescales_to_full_track(self):
        planned_elements = [
            {
                "name": "Step Sequence",
                "type": "sequence",
                "start_time": 0.0,
                "end_time": 10.0,
                "music_peak_time": 9.0,
            },
            {
                "name": "Axel",
                "type": "jump",
                "start_time": 10.0,
                "end_time": 13.0,
                "music_peak_time": 11.0,
            },
            {
                "name": "Camel Spin",
                "type": "spin",
                "start_time": 13.0,
                "end_time": 16.0,
                "music_peak_time": 15.0,
            },
            {
                "name": "Final Pose",
                "type": "pose",
                "start_time": 16.0,
                "end_time": 20.0,
                "music_peak_time": 18.0,
            },
        ]

        normalized = normalize_planned_elements(
            planned_elements,
            100.0,
            target_density={"min_elements": 4, "max_elements": 8},
        )

        self.assertGreaterEqual(normalized[-1]["end_time"], 95.0)
        self.assertEqual(normalized[-1]["name"], "Ina Bauer")
        self.assertEqual(normalized[-1]["type"], "transition")

    def test_normalize_planned_elements_whitelists_names(self):
        planned_elements = [
            {
                "name": "One Foot Glide",
                "type": "transition",
                "start_time": 0.0,
                "end_time": 4.0,
                "music_peak_time": 2.0,
            },
            {
                "name": "Rittberger",
                "type": "jump",
                "start_time": 4.0,
                "end_time": 6.0,
                "music_peak_time": 5.0,
            },
            {
                "name": "Mohawk",
                "type": "turns",
                "start_time": 6.0,
                "end_time": 8.0,
                "music_peak_time": 7.0,
            },
        ]

        normalized = normalize_planned_elements(
            planned_elements,
            24.0,
            target_density={"min_elements": 3, "max_elements": 6},
        )

        allowed_names = {
            name
            for names in PLANNER_ALLOWED_MOVEMENTS.values()
            for name in names
        }
        self.assertTrue(all(item["name"] in allowed_names for item in normalized))
        self.assertEqual(normalized[0]["name"], "Spiral")
        self.assertEqual(normalized[1]["name"], "Loop")
        self.assertEqual(normalized[2]["name"], "Mohawk & Choctaw")


if __name__ == "__main__":
    unittest.main()
