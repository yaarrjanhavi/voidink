"""Health check."""

import sys
from pathlib import Path

from fastapi import APIRouter

ML_ROOT = Path("/app/ml")
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from voidink_api.schemas.emotion import HealthResponse
from voidink_api.routes.predict import get_predictor

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    predictor = get_predictor()
    return HealthResponse(status="ok", model=predictor.model_name, version="0.1.0")
