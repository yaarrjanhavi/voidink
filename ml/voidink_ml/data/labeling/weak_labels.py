"""Weak labeling using keyword seeds."""

from __future__ import annotations

import re
from typing import Iterable

import numpy as np

from voidink_ml.config import get_emotion_ids, get_emotions


def _keyword_score(text: str, keywords: Iterable[str]) -> float:
    text_lower = text.lower()
    hits = sum(1 for kw in keywords if re.search(rf"\b{re.escape(kw)}\b", text_lower))
    if hits == 0:
        return 0.0
    return min(1.0, 0.25 + hits * 0.2)


def weak_label_text(text: str) -> dict[str, float]:
    """Return emotion probabilities from keyword heuristics."""
    cleaned = text.lower()
    scores: dict[str, float] = {}
    for emotion in get_emotions():
        scores[emotion["id"]] = _keyword_score(cleaned, emotion.get("keywords", []))

    # Horror reviews often carry ambient dread even without explicit keywords
    if any(scores.values()):
        scores["dread"] = max(scores.get("dread", 0.0), 0.15)
    else:
        scores["curiosity"] = 0.2

    return scores


def weak_label_batch(texts: list[str]) -> np.ndarray:
    ids = get_emotion_ids()
    matrix = np.zeros((len(texts), len(ids)), dtype=np.float32)
    for i, text in enumerate(texts):
        scores = weak_label_text(text)
        for j, eid in enumerate(ids):
            matrix[i, j] = scores.get(eid, 0.0)
    return matrix
