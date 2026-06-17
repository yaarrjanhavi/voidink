"""Load emotion taxonomy and model config."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml

CONFIG_PATH = Path(__file__).resolve().parent / "emotions.yaml"


@lru_cache(maxsize=1)
def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_emotions() -> list[dict[str, Any]]:
    return load_config()["emotions"]


def get_emotion_ids() -> list[str]:
    return [e["id"] for e in get_emotions()]
