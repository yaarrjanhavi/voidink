"""Steam review collector (requires steam reviews CSV export or API key)."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = ROOT / "data" / "raw"


def fetch_steam_app_reviews(app_id: int, limit: int = 100) -> list[dict]:
    """Fetch reviews from Steam store API (public, no key required)."""
    url = f"https://store.steampowered.com/appreviews/{app_id}"
    params = {
        "json": 1,
        "filter": "all",
        "language": "english",
        "num_per_page": min(limit, 100),
        "review_type": "all",
        "purchase_type": "all",
    }
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    reviews = []
    for item in data.get("reviews", []):
        reviews.append(
            {
                "source": "steam",
                "app_id": app_id,
                "text": item.get("review", ""),
                "recommended": item.get("voted_up"),
                "playtime_forever": item.get("author", {}).get("playtime_forever"),
                "timestamp": item.get("timestamp_created"),
            }
        )
    return reviews


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect Steam reviews")
    parser.add_argument("--app-id", type=int, required=True, help="Steam app ID")
    parser.add_argument("--game-title", type=str, required=True)
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()

    reviews = fetch_steam_app_reviews(args.app_id, args.limit)
    for r in reviews:
        r["game_title"] = args.game_title

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    out = args.output or RAW_DIR / f"steam_{args.app_id}.json"
    with out.open("w", encoding="utf-8") as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(reviews)} reviews to {out}")


if __name__ == "__main__":
    main()
