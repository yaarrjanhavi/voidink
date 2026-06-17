"""Evaluation metrics for multi-label classification."""

from __future__ import annotations

from typing import Any

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    hamming_loss,
    multilabel_confusion_matrix,
    precision_score,
    recall_score,
)


def evaluate_multilabel(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    labels: list[str],
    threshold: float = 0.35,
) -> dict[str, Any]:
    y_true_bin = (y_true >= threshold).astype(int)
    y_pred_bin = (y_pred >= threshold).astype(int)

    return {
        "micro_f1": float(f1_score(y_true_bin, y_pred_bin, average="micro", zero_division=0)),
        "macro_f1": float(f1_score(y_true_bin, y_pred_bin, average="macro", zero_division=0)),
        "micro_precision": float(
            precision_score(y_true_bin, y_pred_bin, average="micro", zero_division=0)
        ),
        "micro_recall": float(recall_score(y_true_bin, y_pred_bin, average="micro", zero_division=0)),
        "hamming_loss": float(hamming_loss(y_true_bin, y_pred_bin)),
        "subset_accuracy": float(accuracy_score(y_true_bin, y_pred_bin)),
        "per_label": classification_report(
            y_true_bin, y_pred_bin, target_names=labels, zero_division=0, output_dict=True
        ),
        "confusion_matrices": {
            label: multilabel_confusion_matrix(y_true_bin, y_pred_bin)[i].tolist()
            for i, label in enumerate(labels)
        },
    }
