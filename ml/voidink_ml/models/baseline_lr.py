"""Baseline TF-IDF + One-vs-Rest Logistic Regression."""

from __future__ import annotations

import pickle
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline

from voidink_ml.config import get_emotion_ids
from voidink_ml.data.preprocess.clean import normalize_for_baseline
from voidink_ml.features.tfidf import build_vectorizer


def build_baseline_pipeline(max_features: int = 50000) -> Pipeline:
    return Pipeline(
        [
            ("tfidf", build_vectorizer(max_features=max_features)),
            (
                "clf",
                OneVsRestClassifier(
                    LogisticRegression(max_iter=1000, C=1.0, class_weight="balanced")
                ),
            ),
        ]
    )


class BaselineEmotionClassifier:
    def __init__(self, max_features: int = 50000):
        self.pipeline = build_baseline_pipeline(max_features)
        self.emotion_ids = get_emotion_ids()

    def fit(self, texts: list[str], labels: np.ndarray) -> None:
        normalized = [normalize_for_baseline(t) for t in texts]
        self.pipeline.fit(normalized, (labels >= 0.35).astype(int))

    def predict_proba(self, texts: list[str]) -> np.ndarray:
        normalized = [normalize_for_baseline(t) for t in texts]
        probas = self.pipeline.predict_proba(normalized)
        # OneVsRest returns list of arrays per class
        if isinstance(probas, list):
            return np.column_stack([p[:, 1] if p.shape[1] > 1 else p[:, 0] for p in probas])
        return probas

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("wb") as f:
            pickle.dump({"pipeline": self.pipeline, "emotion_ids": self.emotion_ids}, f)

    @classmethod
    def load(cls, path: Path) -> "BaselineEmotionClassifier":
        with path.open("rb") as f:
            data = pickle.load(f)
        obj = cls()
        obj.pipeline = data["pipeline"]
        obj.emotion_ids = data["emotion_ids"]
        return obj
