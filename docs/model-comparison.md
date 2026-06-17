# Model Comparison

## Task

Multi-label emotion classification — each review receives 12 independent probability scores (fear, anxiety, dread, sadness, nostalgia, comfort, loneliness, curiosity, disgust, hope, melancholy, confusion).

## Models

### 1. Heuristic (Keyword Baseline)

- **Method:** Keyword matching per emotion with seeded lexicons
- **Use case:** Offline fallback when API unavailable
- **Latency:** Instant

### 2. TF-IDF + One-vs-Rest Logistic Regression

- **Features:** TF-IDF (1–2 grams, max 50k features)
- **Classifier:** Logistic Regression with balanced class weights
- **Loss:** Binary cross-entropy per label
- **Train:** `python ml/voidink_ml/train/train_baseline.py`
- **Artifact:** `models/baseline_lr.pkl`

### 3. DistilBERT (Planned)

- **Base:** `distilbert-base-uncased`
- **Head:** Linear layer → 12 sigmoid outputs
- **Loss:** BCEWithLogitsLoss
- **Expected latency:** ~40ms/review on CPU

### 4. RoBERTa (Planned)

- **Base:** `roberta-base`
- **Expected:** Highest macro-F1, slower inference

## Evaluation Metrics

| Metric | Description |
|--------|-------------|
| Micro F1 | Global F1 across all labels |
| Macro F1 | Mean F1 per emotion (handles imbalance) |
| Hamming Loss | Fraction of wrong labels |
| Subset Accuracy | Exact match of all labels |
| Per-label P/R/F1 | Individual emotion performance |
| Confusion matrices | Per-emotion TP/FP/FN/TN |

## Threshold

Default probability threshold: **0.35** (tunable per emotion on validation set).

## Running Evaluation

```bash
python ml/voidink_ml/train/train_baseline.py
cat models/baseline_metrics.json
```

Results are written to `models/baseline_metrics.json` after baseline training.
