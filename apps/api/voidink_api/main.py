"""voidink FastAPI application."""

import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ML_ROOT = Path("/app/ml")
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from voidink_api.config import settings
from voidink_api.routes.health import router as health_router
from voidink_api.routes.predict import router as predict_router

app = FastAPI(
    title=settings.api_title,
    description="Indie horror review emotion classification API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://voidink-eight.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(predict_router)


@app.get("/")
def root() -> dict:
    return {
        "name": "voidink",
        "docs": "/docs",
        "status": "online",
    }
