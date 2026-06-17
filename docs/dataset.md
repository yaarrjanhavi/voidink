# Dataset Documentation

## Overview

voidink aggregates indie horror game reviews from multiple sources into a unified schema for multi-label emotion classification.

## Unified Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique review identifier |
| `source` | enum | `steam`, `reddit`, `kaggle`, `web` |
| `game_title` | string | Human-readable game name |
| `game_slug` | string | URL-safe slug |
| `text` | string | Review body |
| `lang` | string | ISO language code |
| `recommended` | bool | Thumbs up / recommend (if available) |
| `metadata` | JSON | Source-specific fields |

## Sources

### Steam

- **Method:** Public Store API (`/appreviews/{app_id}`)
- **Script:** `ml/voidink_ml/data/collectors/steam.py`
- **Example:** OMORI (app_id: 1150690)

### Reddit

- **Method:** PRAW API
- **Subreddits:** r/horrorgaming, game-specific communities
- **Requires:** `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` env vars

### Kaggle

- Import existing game review datasets and normalize to unified schema.

### Review Websites

- RSS feeds and respectful scraping where permitted.

## Sample Data

`data/sample/sample_reviews.csv` contains 20 curated reviews across OMORI, Fran Bow, Sally Face, Mouthwashing, and Little Misfortune for development and baseline training.

## Labeling

1. **Weak labels:** Keyword seeds per emotion (`ml/voidink_ml/data/labeling/weak_labels.py`)
2. **LLM-assisted:** Batch annotation with strict JSON schema (planned)
3. **Human gold set:** 2,000+ manually verified reviews (planned)

## Preprocessing

- Language filter (English)
- HTML/URL/Steam BBCode removal
- Deduplication via text hashing
- Train/val/test split stratified by game
