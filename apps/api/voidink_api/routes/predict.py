"""Prediction routes."""

import sys
import time
from pathlib import Path

from fastapi import APIRouter, HTTPException

# Add ml package to path
Path("/app/ml")
Path("/app/models")
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from voidink_ml.inference.predictor import EmotionPredictor
from voidink_api.config import settings
from voidink_api.schemas.emotion import (
    BatchPredictRequest,
    BatchPredictResponse,
    EmotionScore,
    PredictRequest,
    PredictResponse,
)

router = APIRouter(prefix="/v1", tags=["predict"])

_predictor: EmotionPredictor | None = None


def get_predictor() -> EmotionPredictor:
    global _predictor
    if _predictor is None:
        _predictor = EmotionPredictor(mode=settings.model_mode)
    return _predictor


@router.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest) -> PredictResponse:
    start = time.perf_counter()
    predictor = get_predictor()
    emotions = predictor.predict(body.text)
    _ = (time.perf_counter() - start) * 1000  # reserved for future timing field
    return PredictResponse(
        emotions=[EmotionScore(**e) for e in emotions],
        model=predictor.model_name,
        text_length=len(body.text),
    )


@router.post("/predict/batch", response_model=BatchPredictResponse)
def predict_batch(body: BatchPredictRequest) -> BatchPredictResponse:
    if len(body.texts) > 500:
        raise HTTPException(status_code=400, detail="Maximum 500 texts per batch")
    predictor = get_predictor()
    raw = predictor.predict_batch(body.texts)
    summary = predictor.summarize_batch(raw)
    return BatchPredictResponse(
        results=[[EmotionScore(**e) for e in review] for review in raw],
        summary=summary,
        model=predictor.model_name,
        count=len(body.texts),
    )
