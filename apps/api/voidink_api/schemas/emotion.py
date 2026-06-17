"""Pydantic schemas."""

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)


class EmotionScore(BaseModel):
    id: str
    label: str
    probability: float
    color: str


class PredictResponse(BaseModel):
    emotions: list[EmotionScore]
    model: str
    text_length: int


class BatchPredictRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=500)


class BatchPredictResponse(BaseModel):
    results: list[list[EmotionScore]]
    summary: dict[str, float]
    model: str
    count: int


class HealthResponse(BaseModel):
    status: str
    model: str
    version: str
