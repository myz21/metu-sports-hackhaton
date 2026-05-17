import unittest

from src.vision.rag import build_rag_context, retrieve_relevant_documents


class SkatingRagTests(unittest.TestCase):
    def test_retrieval_prefers_matching_spin_documents(self):
        documents = retrieve_relevant_documents(
            movement_name="Sit Spin",
            movement_type="spin",
            top_k=3,
        )

        self.assertGreater(len(documents), 0)
        self.assertEqual(documents[0].id, "sit_spin")

    def test_rag_context_contains_prompt_text(self):
        context = build_rag_context(
            movement_name="Final Pose",
            movement_type="pose",
            top_k=2,
        )

        self.assertIn("Final Pose", context["prompt_context"])
        self.assertGreater(len(context["document_ids"]), 0)

    def test_compact_rag_context_can_be_trimmed(self):
        context = build_rag_context(
            movement_name="Sit Spin",
            movement_type="spin",
            top_k=3,
            compact=True,
            max_chars=200,
            max_items_per_section=1,
        )

        self.assertLessEqual(len(context["prompt_context"]), 200)
        self.assertIn("Sit Spin", context["prompt_context"])


if __name__ == "__main__":
    unittest.main()
