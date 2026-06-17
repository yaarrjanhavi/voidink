'use client';

import type { EmotionScore } from '@/lib/emotions';

interface Props {
  emotions: EmotionScore[];
  threshold?: number;
}

export function EmotionBars({ emotions, threshold = 0.2 }: Props) {
  const visible = emotions.filter((e) => e.probability >= threshold);

  return (
    <ul className="space-y-3">
      {visible.map((emotion) => (
        <li key={emotion.id}>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="typewriter-title text-sm" style={{ color: emotion.color }}>
              {emotion.label}
            </span>
            <span className="text-xs text-ink-ghost">
              {(emotion.probability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="emotion-bar-track">
            <div
              className="emotion-bar-fill"
              style={{
                width: `${Math.min(100, emotion.probability * 100)}%`,
                ['--bar-color' as string]: emotion.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
