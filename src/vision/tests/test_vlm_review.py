import unittest

from src.vision.vlm_review import (
    _resolve_quality_settings,
    _resolve_request_budget,
    _score_vlm_element,
)


class VlmReviewTests(unittest.TestCase):
    def test_low_quality_profile_prefers_cheaper_defaults(self):
        settings = _resolve_quality_settings(
            quality_profile="low",
            model=None,
            cheap_mode=None,
            frame_padding_seconds=None,
            max_frames_per_element=None,
            frame_max_dimension=None,
            jpeg_quality=None,
            image_detail=None,
            rag_top_k=None,
            max_rag_context_chars=None,
        )

        self.assertEqual(settings["model"], "gpt-4.1-mini")
        self.assertTrue(settings["cheap_mode"])
        self.assertEqual(settings["image_detail"], "low")

    def test_high_quality_profile_prefers_richer_defaults(self):
        settings = _resolve_quality_settings(
            quality_profile="high",
            model=None,
            cheap_mode=None,
            frame_padding_seconds=None,
            max_frames_per_element=None,
            frame_max_dimension=None,
            jpeg_quality=None,
            image_detail=None,
            rag_top_k=None,
            max_rag_context_chars=None,
        )

        self.assertEqual(settings["model"], "gpt-4.1")
        self.assertFalse(settings["cheap_mode"])
        self.assertEqual(settings["image_detail"], "high")

    def test_cheap_mode_reduces_frame_and_rag_budget(self):
        budget = _resolve_request_budget(
            planned_element={
                "name": "Sit Spin",
                "type": "spin",
                "start_time": 10.0,
                "end_time": 16.0,
                "music_peak_time": 14.0,
            },
            quality_profile="low",
            cheap_mode=True,
            frame_padding_seconds=0.75,
            max_frames_per_element=6,
            frame_max_dimension=None,
            jpeg_quality=85,
            image_detail="low",
            rag_top_k=4,
            max_rag_context_chars=None,
        )

        self.assertEqual(budget["max_frames"], 3)
        self.assertEqual(budget["rag_top_k"], 2)
        self.assertEqual(budget["frame_max_dimension"], 768)
        self.assertEqual(budget["jpeg_quality"], 72)

    def test_rule_feedback_uses_deterministic_late_label(self):
        review = _score_vlm_element(
            planned_element={
                "name": "Sit Spin",
                "type": "spin",
                "start_time": 0.35,
                "end_time": 6.0,
                "music_peak_time": 6.0,
            },
            frame_bundle={
                "window_start": 0.0,
                "window_end": 6.5,
                "frames": [
                    {
                        "timestamp_seconds": 0.0,
                        "frame_index": 0,
                        "image_data_url": "data:image/jpeg;base64,AAA",
                        "image_size": {"width": 768, "height": 432},
                    }
                ],
            },
            rag_context={
                "document_ids": ["sit_spin"],
                "document_titles": ["Sit Spin"],
                "prompt_context": "Sit Spin context",
            },
            vlm_payload={
                "apparent_start_time": 1.27,
                "apparent_end_time": 5.10,
                "apparent_peak_time": 3.83,
                "stability_assessment": "moderate",
                "confidence": 0.85,
                "coaching_cue": "Hold the spin a little longer.",
                "confidence_note": "Moderate confidence.",
                "technical_observations": [
                    "Spin appears visible.",
                ],
            },
            request_budget={
                "quality_profile": "low",
                "cheap_mode": True,
                "image_detail": "low",
                "frame_padding_seconds": 0.5,
                "frame_max_dimension": 768,
                "jpeg_quality": 72,
                "rag_top_k": 2,
                "max_rag_context_chars": 900,
            },
        )

        self.assertEqual(review["rule_assessment"]["timing_assessment"], "late")
        self.assertIn("late", review["local_feedback"]["short_feedback"])

    def test_softened_scoring_does_not_zero_small_late_offsets(self):
        review = _score_vlm_element(
            planned_element={
                "name": "Two Foot Spin",
                "type": "spin",
                "start_time": 4.0,
                "end_time": 5.2,
                "music_peak_time": 5.2,
            },
            frame_bundle={
                "window_start": 3.5,
                "window_end": 5.7,
                "frames": [
                    {
                        "timestamp_seconds": 4.0,
                        "frame_index": 0,
                        "image_data_url": "data:image/jpeg;base64,AAA",
                        "image_size": {"width": 768, "height": 432},
                    }
                ],
            },
            rag_context={
                "document_ids": ["sit_spin"],
                "document_titles": ["Sit Spin"],
                "prompt_context": "Spin context",
            },
            vlm_payload={
                "apparent_start_time": 4.265,
                "apparent_end_time": 4.936,
                "apparent_peak_time": 4.6,
                "stability_assessment": "moderate",
                "confidence": 0.85,
                "coaching_cue": "Hold the center.",
                "confidence_note": "Good confidence.",
                "technical_observations": [
                    "Spin appears slightly delayed.",
                ],
            },
            request_budget={
                "quality_profile": "high",
                "cheap_mode": False,
                "image_detail": "high",
                "frame_padding_seconds": 0.4,
                "frame_max_dimension": 1024,
                "jpeg_quality": 82,
                "rag_top_k": 4,
                "max_rag_context_chars": 1600,
            },
        )

        self.assertGreater(review["scores"]["start_score"], 0.0)
        self.assertGreater(review["scores"]["music_alignment_score"], 0.0)
        self.assertGreater(review["scores"]["execution_match_score"], 50.0)


if __name__ == "__main__":
    unittest.main()
