"""Local skating knowledge retrieval for RAG-style prompting."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


STOP_WORDS = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "basic",
    "planned",
    "element",
    "movement",
}


@dataclass
class KnowledgeDocument:
    id: str
    title: str
    category: str
    aliases: list[str]
    summary: str
    timing_cues: list[str]
    stability_cues: list[str]
    duration_cues: list[str]
    coaching_cues: list[str]

    def searchable_text(self) -> str:
        pieces = [
            self.title,
            self.category,
            *self.aliases,
            self.summary,
            *self.timing_cues,
            *self.stability_cues,
            *self.duration_cues,
            *self.coaching_cues,
        ]
        return " ".join(pieces).lower()

    def prompt_block(
        self,
        *,
        compact: bool = False,
        max_items_per_section: int = 2,
    ) -> str:
        if compact:
            timing = "; ".join(self.timing_cues[:max_items_per_section])
            stability = "; ".join(self.stability_cues[:max_items_per_section])
            duration = "; ".join(self.duration_cues[:max_items_per_section])
            coaching = "; ".join(self.coaching_cues[:max_items_per_section])
            return (
                f"{self.title} ({self.category}) | Summary: {self.summary} | "
                f"Timing: {timing} | Stability: {stability} | "
                f"Duration: {duration} | Coaching: {coaching}"
            )

        return (
            f"Document: {self.title}\n"
            f"Category: {self.category}\n"
            f"Summary: {self.summary}\n"
            f"Timing cues: {'; '.join(self.timing_cues)}\n"
            f"Stability cues: {'; '.join(self.stability_cues)}\n"
            f"Duration cues: {'; '.join(self.duration_cues)}\n"
            f"Coaching cues: {'; '.join(self.coaching_cues)}"
        )


def load_knowledge_base(
    knowledge_path: str | Path | None = None,
) -> list[KnowledgeDocument]:
    path = (
        Path(knowledge_path)
        if knowledge_path
        else Path(__file__).with_name("knowledge") / "figure_skating_knowledge.json"
    )
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [KnowledgeDocument(**item) for item in payload]


def retrieve_relevant_documents(
    *,
    movement_name: str,
    movement_type: str,
    top_k: int = 4,
    knowledge_path: str | Path | None = None,
) -> list[KnowledgeDocument]:
    documents = load_knowledge_base(knowledge_path)
    query = f"{movement_name} {movement_type}".lower()
    query_tokens = _tokenize(query)

    scored_docs: list[tuple[float, KnowledgeDocument]] = []
    for document in documents:
        score = _score_document(document, query, query_tokens)
        if score > 0:
            scored_docs.append((score, document))

    scored_docs.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in scored_docs[:top_k]]


def build_rag_context(
    *,
    movement_name: str,
    movement_type: str,
    top_k: int = 4,
    knowledge_path: str | Path | None = None,
    compact: bool = False,
    max_chars: int | None = None,
    max_items_per_section: int = 2,
) -> dict[str, Any]:
    documents = retrieve_relevant_documents(
        movement_name=movement_name,
        movement_type=movement_type,
        top_k=top_k,
        knowledge_path=knowledge_path,
    )
    prompt_context = "\n\n".join(
        document.prompt_block(
            compact=compact,
            max_items_per_section=max_items_per_section,
        )
        for document in documents
    )
    if max_chars is not None and len(prompt_context) > max_chars:
        prompt_context = prompt_context[: max_chars - 3].rstrip() + "..."

    return {
        "document_ids": [document.id for document in documents],
        "document_titles": [document.title for document in documents],
        "prompt_context": prompt_context,
    }


def _score_document(
    document: KnowledgeDocument,
    query: str,
    query_tokens: set[str],
) -> float:
    score = 0.0
    title = document.title.lower()
    aliases = [alias.lower() for alias in document.aliases]
    searchable_text = document.searchable_text()

    if query in title or any(query in alias for alias in aliases):
        score += 12.0

    for alias in aliases:
        if alias in query or query in alias:
            score += 8.0

    if document.category.lower() in query:
        score += 3.0

    document_tokens = _tokenize(searchable_text)
    token_overlap = len(query_tokens & document_tokens)
    score += float(token_overlap)

    return score


def _tokenize(text: str) -> set[str]:
    tokens = set(re.findall(r"[a-z0-9_]+", text.lower()))
    return {token for token in tokens if token not in STOP_WORDS}
