"""TF-IDF feature extraction."""

from __future__ import annotations

from sklearn.feature_extraction.text import TfidfVectorizer


def build_vectorizer(max_features: int = 50000, ngram_range: tuple[int, int] = (1, 2)) -> TfidfVectorizer:
    return TfidfVectorizer(
        max_features=max_features,
        ngram_range=ngram_range,
        min_df=2,
        max_df=0.95,
        sublinear_tf=True,
    )
