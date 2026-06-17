import type { BatchPredictResponse, PredictResponse } from './emotions';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function predictReview(text: string): Promise<PredictResponse> {
  return request<PredictResponse>('/v1/predict', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function predictBatch(texts: string[]): Promise<BatchPredictResponse> {
  return request<BatchPredictResponse>('/v1/predict/batch', {
    method: 'POST',
    body: JSON.stringify({ texts }),
  });
}

export async function checkHealth(): Promise<{ status: string; model: string }> {
  return request('/health');
}

/** Client-side heuristic fallback when API is unavailable */
export function heuristicPredict(text: string) {
  const lower = text.toLowerCase();
  const keywordMap: Record<string, string[]> = {
    fear: ['scared', 'terrified', 'frightening', 'horror'],
    anxiety: ['anxious', 'uneasy', 'tense', 'paranoid'],
    dread: ['dread', 'unsettling', 'ominous', 'foreboding'],
    sadness: ['sad', 'cry', 'heartbreaking', 'tragic'],
    nostalgia: ['nostalgic', 'childhood', 'memories', 'retro'],
    comfort: ['comfort', 'cozy', 'wholesome', 'warm'],
    loneliness: ['lonely', 'alone', 'isolated', 'empty'],
    curiosity: ['curious', 'mystery', 'intriguing', 'secrets'],
    disgust: ['disgusting', 'gross', 'body horror', 'revolting'],
    hope: ['hope', 'redemption', 'healing', 'light'],
    melancholy: ['melancholy', 'wistful', 'somber', 'bittersweet'],
    confusion: ['confused', 'surreal', 'bizarre', 'mind-bending'],
  };

  const emotions = Object.entries(keywordMap).map(([id, keywords]) => {
    const hits = keywords.filter((kw) => lower.includes(kw)).length;
    const probability = hits > 0 ? Math.min(0.95, 0.3 + hits * 0.2) : 0.05;
    const meta = { fear: '#8B2635', anxiety: '#5C4B51', dread: '#ad7faf', sadness: '#4A6670',
      nostalgia: '#7A6C5D', comfort: '#6B7F6B', loneliness: '#8b90ba', curiosity: '#8B7E74',
      disgust: '#556B2F', hope: '#9CAF88', melancholy: '#5D5A6D', confusion: '#6E6A6F' } as Record<string, string>;
    const labels: Record<string, string> = {
      fear: 'Fear', anxiety: 'Anxiety', dread: 'Dread', sadness: 'Sadness',
      nostalgia: 'Nostalgia', comfort: 'Comfort', loneliness: 'Loneliness',
      curiosity: 'Curiosity', disgust: 'Disgust', hope: 'Hope',
      melancholy: 'Melancholy', confusion: 'Confusion',
    };
    return { id, label: labels[id], probability, color: meta[id] };
  });

  emotions.sort((a, b) => b.probability - a.probability);
  return { emotions, model: 'heuristic-fallback', text_length: text.length };
}
