"""DistilBERT multi-label training (requires torch + transformers)."""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def main() -> None:
    parser = argparse.ArgumentParser(description="Train DistilBERT multi-label classifier")
    parser.add_argument("--data", type=Path, default=ROOT / "data" / "sample" / "sample_reviews.csv")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--output", type=Path, default=ROOT / "models" / "distilbert")
    args = parser.parse_args()

    try:
        import torch
        from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
    except ImportError as e:
        raise SystemExit(
            "Install ML extras: pip install torch transformers datasets\n" f"Missing: {e}"
        ) from e

    print("DistilBERT training scaffold ready.")
    print(f"Data: {args.data}")
    print(f"Output: {args.output}")
    print("Implement full training loop with weak labels or gold labels.")
    print("See docs/model-comparison.md for evaluation protocol.")


if __name__ == "__main__":
    main()
