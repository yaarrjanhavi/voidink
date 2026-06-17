"""Text cleaning and normalization."""

from __future__ import annotations

import re
import unicodedata

URL_PATTERN = re.compile(r"https?://\S+|www\.\S+")
HTML_PATTERN = re.compile(r"<[^>]+>")
STEAM_BBCODE = re.compile(r"\[[^\]]+\]")
WHITESPACE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKC", text)
    text = HTML_PATTERN.sub(" ", text)
    text = STEAM_BBCODE.sub(" ", text)
    text = URL_PATTERN.sub(" ", text)
    text = WHITESPACE.sub(" ", text).strip()
    return text


def normalize_for_baseline(text: str) -> str:
    return clean_text(text).lower()
