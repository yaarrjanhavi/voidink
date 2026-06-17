# voidink

**Read the silence between the lines.**

Indie horror game reviews → multi-label emotion map. Detects fear, dread, nostalgia, loneliness, and nine other emotions with confidence scores — not just positive/negative sentiment.

![voidink banner](assets/architecture-diagram.svg)

## Features

- **12-emotion multi-label detection** with probability scores
- **Single review analysis** — paste and explore
- **CSV batch upload** — analyze hundreds of reviews, export results
- **Cross-game comparison** — emotion fingerprints across titles
- **Horror notebook UI** — hand-drawn aesthetic inspired by OMORI, Fran Bow, Sally Face
- **Model comparison** — TF-IDF + Logistic Regression vs transformer models

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Data Sources   │────▶│   ML Pipeline    │────▶│  Model Registry │
│ Steam/Reddit/   │     │ clean → label →  │     │ baseline.pkl    │
│ Kaggle/Web      │     │ train → evaluate │     │ distilbert/     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌──────────────────┐              │
                        │  FastAPI (API)   │◀─────────────┘
                        │  /v1/predict     │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Next.js (Vercel) │
                        │ voidink web app  │
                        └──────────────────┘
```

## Emotions Tracked

| Emotion | Description |
|---------|-------------|
| Fear | Immediate fright, jump-scare reactions |
| Anxiety | Unease, tension, nervous anticipation |
| Dread | Slow-building existential horror |
| Sadness | Grief, sorrow, emotional pain |
| Nostalgia | Bittersweet memories, childhood echoes |
| Comfort | Warmth amid darkness |
| Loneliness | Isolation, emptiness |
| Curiosity | Mystery, wanting to uncover secrets |
| Disgust | Revulsion, body horror |
| Hope | Light in darkness |
| Melancholy | Wistful, beautiful sorrow |
| Confusion | Disorientation, unreliable reality |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm

### 1. Install dependencies

```bash
# Root + web
npm install

# Python (API + ML)
pip install -e ".[dev]"
pip install -r apps/api/requirements.txt
```

### 2. Train baseline model (optional)

```bash
python ml/voidink_ml/train/train_baseline.py
```

### 3. Start API

```bash
cd apps/api
set PYTHONPATH=../../ml;%PYTHONPATH%
python -m uvicorn voidink_api.main:app --reload --port 8000
```

### 4. Start web

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push repo to GitHub
2. Import project in Vercel — set **Root Directory** to `apps/web`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-api.railway.app`
4. Deploy API separately (Railway/Render) with `MODEL_MODE=auto`

## Project Structure

```
voidink/
├── apps/
│   ├── web/          # Next.js frontend (Vercel)
│   └── api/          # FastAPI inference service
├── ml/
│   └── voidink_ml/   # Data, training, evaluation
├── data/
│   └── sample/       # Sample reviews CSV
├── models/           # Trained model artifacts
├── docs/             # Documentation
└── assets/           # Architecture diagram, brand
```

## Model Comparison

| Model | Macro F1 | Micro F1 | Latency | Status |
|-------|----------|----------|---------|--------|
| Heuristic (keywords) | — | — | instant | ✅ Fallback |
| TF-IDF + LogReg | run train | run train | ~1ms | ✅ Implemented |
| DistilBERT | TBD | TBD | ~40ms | 🔜 Planned |
| RoBERTa | TBD | TBD | ~60ms | 🔜 Planned |

Run `python ml/voidink_ml/train/train_baseline.py` to generate baseline metrics in `models/baseline_metrics.json`.

## Dataset

See [docs/dataset.md](docs/dataset.md) for sources, schema, and collection instructions.

Collect Steam reviews:

```bash
python ml/voidink_ml/data/collectors/steam.py --app-id 1150690 --game-title OMORI --limit 100
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/v1/predict` | Single review → emotions |
| POST | `/v1/predict/batch` | Batch reviews → emotions + summary |

## Screenshots

_Add screenshots to `apps/web/public/screenshots/` after running locally._

## Future Enhancements

- [ ] DistilBERT / RoBERTa fine-tuning scripts
- [ ] Human-labeled gold evaluation set
- [ ] Supabase for persistent game aggregates
- [ ] Attention-based explainability
- [ ] Multilingual review support
- [ ] Game similarity UMAP visualization

## License

MIT
