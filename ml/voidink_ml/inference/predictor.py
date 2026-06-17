"""Unified inference interface."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np

from voidink_ml.config import get_emotion_ids, get_emotions
from voidink_ml.data.labeling.weak_labels import weak_label_text
from voidink_ml.data.preprocess.clean import clean_text
from voidink_ml.models.baseline_lr import BaselineEmotionClassifier

MODELS_DIR = Path(__file__).resolve().parents[3] / "models"


class EmotionPredictor:
    """Load trained baseline model or fall back to heuristic labeling."""

    def __init__(self, mode: str = "auto"):
        self.mode = mode
        self.emotion_ids = get_emotion_ids()
        self.emotions = get_emotions()
        self.model: BaselineEmotionClassifier | None = None
        self.model_name = "heuristic-v1"
        self._load_model()

    def _load_model(self) -> None:
        baseline_path = MODELS_DIR / "baseline_lr.pkl"
        if self.mode in ("auto", "baseline") and baseline_path.exists():
            self.model = BaselineEmotionClassifier.load(baseline_path)
            self.model_name = "tfidf-logreg-v1"
        elif self.mode == "heuristic":
            self.model = None
            self.model_name = "heuristic-v1"

    def predict(self, text: str) -> list[dict[str, Any]]:
        cleaned = clean_text(text)
        if not cleaned:
            return self._format_scores({eid: 0.0 for eid in self.emotion_ids})

        if self.model:
            probas = self.model.predict_proba([cleaned])[0]
            scores = {eid: float(probas[i]) for i, eid in enumerate(self.emotion_ids)}
        else:
            scores = weak_label_text(cleaned)

        return self._format_scores(scores)

    def predict_batch(self, texts: list[str]) -> list[list[dict[str, Any]]]:
        return [self.predict(t) for t in texts]

    def _format_scores(self, scores: dict[str, float]) -> list[dict[str, Any]]:
        emotion_map = {e["id"]: e for e in self.emotions}
        results = []
        for eid in self.emotion_ids:
            meta = emotion_map[eid]
            results.append(
                {
                    "id": eid,
                    "label": meta["label"],
                    "probability": round(float(scores.get(eid, 0.0)), 4),
                    "color": meta["color"],
                }
            )
        results.sort(key=lambda x: x["probability"], reverse=True)
        return results

    def summarize_batch(self, results: list[list[dict[str, Any]]]) -> dict[str, float]:
        if not results:
            return {}
        sums: dict[str, float] = {eid: 0.0 for eid in self.emotion_ids}
        for review in results:
            for item in review:
                sums[item["id"]] += item["probability"]
        n = len(results)
        return {k: round(v / n, 4) for k, v in sums.items()}
