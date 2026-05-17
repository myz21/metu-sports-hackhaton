"""Shared skating movement knowledge utilities for the voice pipeline."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path


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
    "move",
}


@dataclass
class KnowledgeDocument:
    id: str
    title: str
    category: str
    aliases: list[str]
    summary: str
    timing_cues: list[str]
    execution_cues: list[str]
    coaching_cues: list[str]

    def searchable_text(self) -> str:
        pieces = [
            self.title,
            self.category,
            *self.aliases,
            self.summary,
            *self.timing_cues,
            *self.execution_cues,
            *self.coaching_cues,
        ]
        return " ".join(pieces).lower()

    def prompt_block(
        self,
        *,
        compact: bool = True,
        max_items_per_section: int = 2,
    ) -> str:
        if compact:
            timing = "; ".join(self.timing_cues[:max_items_per_section])
            execution = "; ".join(self.execution_cues[:max_items_per_section])
            coaching = "; ".join(self.coaching_cues[:max_items_per_section])
            return (
                f"{self.title} ({self.category}) | Ozet: {self.summary} | "
                f"Timing: {timing} | Teknik: {execution} | Kocluk: {coaching}"
            )

        return (
            f"Belge: {self.title}\n"
            f"Kategori: {self.category}\n"
            f"Ozet: {self.summary}\n"
            f"Timing ipuclari: {'; '.join(self.timing_cues)}\n"
            f"Teknik ipuclari: {'; '.join(self.execution_cues)}\n"
            f"Kocluk ipuclari: {'; '.join(self.coaching_cues)}"
        )


def default_knowledge_path() -> Path:
    return Path(__file__).with_name("knowledge") / "figure_skating_knowledge.json"


def load_knowledge_base(knowledge_path: str | Path | None = None) -> list[KnowledgeDocument]:
    path = Path(knowledge_path) if knowledge_path else default_knowledge_path()
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [KnowledgeDocument(**item) for item in payload]


def retrieve_relevant_documents(
    *,
    movement_name: str,
    movement_type: str = "",
    top_k: int = 3,
    knowledge_path: str | Path | None = None,
) -> list[KnowledgeDocument]:
    documents = load_knowledge_base(knowledge_path)
    query = f"{movement_name} {movement_type}".strip().lower()
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
    movement_type: str = "",
    top_k: int = 3,
    max_chars: int | None = 1200,
    knowledge_path: str | Path | None = None,
) -> dict[str, object]:
    documents = retrieve_relevant_documents(
        movement_name=movement_name,
        movement_type=movement_type,
        top_k=top_k,
        knowledge_path=knowledge_path,
    )
    prompt_context = "\n\n".join(document.prompt_block() for document in documents)
    if max_chars is not None and len(prompt_context) > max_chars:
        prompt_context = prompt_context[: max_chars - 3].rstrip() + "..."

    return {
        "document_ids": [document.id for document in documents],
        "document_titles": [document.title for document in documents],
        "prompt_context": prompt_context,
    }


def build_catalog_overview(
    knowledge_path: str | Path | None = None,
) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for document in load_knowledge_base(knowledge_path):
        grouped.setdefault(document.category, []).append(document.title)

    for values in grouped.values():
        values.sort()
    return dict(sorted(grouped.items(), key=lambda item: item[0]))


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
    score += float(len(query_tokens & document_tokens))
    return score


def _tokenize(text: str) -> set[str]:
    tokens = set(re.findall(r"[a-z0-9_]+", text.lower()))
    return {token for token in tokens if token not in STOP_WORDS}
