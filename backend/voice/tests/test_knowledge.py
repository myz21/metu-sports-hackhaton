import unittest

from src.voice.knowledge import build_catalog_overview, build_rag_context


class KnowledgeTests(unittest.TestCase):
    def test_catalog_overview_groups_movements(self):
        overview = build_catalog_overview()
        self.assertIn("jump", overview)
        self.assertIn("spin", overview)
        self.assertIn("transition", overview)
        self.assertIn("Axel", overview["jump"])

    def test_rag_context_finds_relevant_spin_docs(self):
        context = build_rag_context(movement_name="Camel Spin", movement_type="spin", top_k=2)
        titles = context["document_titles"]
        self.assertTrue(any("Camel Spin" == title for title in titles))


if __name__ == "__main__":
    unittest.main()
