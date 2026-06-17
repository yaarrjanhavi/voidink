"""Train baseline model on sample/labeled data."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd

from voidink_ml.config import get_emotion_ids
from voidink_ml.data.labeling.weak_labels import weak_label_batch
from voidink_ml.evaluate.metrics import evaluate_multilabel
from voidink_ml.models.baseline_lr import BaselineEmotionClassifier

ROOT = Path(__file__).resolve().parents[3]
SAMPLE_CSV = ROOT / "data" / "sample" / "sample_reviews.csv"
MODELS_DIR = ROOT / "models"


def load_reviews(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    required = {"text", "game_title"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"CSV missing columns: {missing}")
    return df


def main() -> None:
    parser = argparse.ArgumentParser(description="Train TF-IDF + Logistic Regression baseline")
    parser.add_argument("--data", type=Path, default=SAMPLE_CSV)
    parser.add_argument("--output", type=Path, default=MODELS_DIR / "baseline_lr.pkl")
    args = parser.parse_args()

    df = load_reviews(args.data)
    texts = df["text"].astype(str).tolist()
    labels = weak_label_batch(texts)

    split = int(len(texts) * 0.8)
    train_texts, val_texts = texts[:split], texts[split:]
    train_labels, val_labels = labels[:split], labels[split:]

    clf = BaselineEmotionClassifier()
    clf.fit(train_texts, train_labels)

    val_pred = clf.predict_proba(val_texts) if val_texts else train_labels
    val_true = val_labels if val_texts else train_labels
    metrics = evaluate_multilabel(val_true, val_pred, get_emotion_ids())

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    clf.save(args.output)

    report_path = MODELS_DIR / "baseline_metrics.json"
    with report_path.open("w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"Model saved to {args.output}")
    print(f"Macro F1: {metrics['macro_f1']:.4f}")
    print(f"Micro F1: {metrics['micro_f1']:.4f}")


if __name__ == "__main__":
    main()
