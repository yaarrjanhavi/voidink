export interface EmotionScore {
  id: string;
  label: string;
  probability: number;
  color: string;
}

export interface PredictResponse {
  emotions: EmotionScore[];
  model: string;
  text_length: number;
}

export interface BatchPredictResponse {
  results: EmotionScore[][];
  summary: Record<string, number>;
  model: string;
  count: number;
}

export const EMOTIONS = [
  { id: 'fear', label: 'Fear', color: '#8B2635' },
  { id: 'anxiety', label: 'Anxiety', color: '#5C4B51' },
  { id: 'dread', label: 'Dread', color: '#2D1B2E' },
  { id: 'sadness', label: 'Sadness', color: '#4A6670' },
  { id: 'nostalgia', label: 'Nostalgia', color: '#7A6C5D' },
  { id: 'comfort', label: 'Comfort', color: '#6B7F6B' },
  { id: 'loneliness', label: 'Loneliness', color: '#3D405B' },
  { id: 'curiosity', label: 'Curiosity', color: '#8B7E74' },
  { id: 'disgust', label: 'Disgust', color: '#556B2F' },
  { id: 'hope', label: 'Hope', color: '#9CAF88' },
  { id: 'melancholy', label: 'Melancholy', color: '#5D5A6D' },
  { id: 'confusion', label: 'Confusion', color: '#6E6A6F' },
] as const;

export const EMOTION_MAP = Object.fromEntries(EMOTIONS.map((e) => [e.id, e]));
