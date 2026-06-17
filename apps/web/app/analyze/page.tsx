'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EmotionBars } from '@/components/emotion/EmotionBars';
import { EmotionRadar } from '@/components/charts/PlotlyEmotionChart';
import { heuristicPredict, predictReview } from '@/lib/api-client';
import type { EmotionScore } from '@/lib/emotions';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState<EmotionScore[]>([]);
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('voidink-review');
    if (!stored) {
      setLoading(false);
      return;
    }
    setText(stored);

    (async () => {
      try {
        const res = await predictReview(stored);
        setEmotions(res.emotions);
        setModel(res.model);
      } catch {
        const fallback = heuristicPredict(stored);
        setEmotions(fallback.emotions);
        setModel(fallback.model + ' (offline)');
        setError('API unavailable — using local heuristic fallback.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!text && !loading) {
    return (
      <div className="paper-card text-center">
        <p className="text-ink-ghost">No review to analyze.</p>
        <Link href="/" className="ink-button mt-4 inline-block">
          write one
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="paper-card">
        <p className="text-xs uppercase tracking-widest text-ink-ghost">analysis</p>
        <h1 className="typewriter-title mt-1 text-2xl">Emotion Map</h1>
        {model && <p className="mt-1 text-xs text-ink-ghost">model: {model}</p>}
        {error && <p className="mt-2 text-xs text-ink-rust">{error}</p>}
      </header>

      <div className="paper-card">
        <p className="typewriter-title mb-2 text-xs text-ink-ghost">source text</p>
        <p className="text-sm leading-relaxed italic text-ink-faded">&ldquo;{text}&rdquo;</p>
      </div>

      {loading ? (
        <div className="paper-card animate-pulse text-center text-ink-ghost">
          reading between the lines...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="paper-card">
            <h2 className="typewriter-title mb-4 text-lg">Confidence</h2>
            <EmotionBars emotions={emotions} />
          </div>
          <div className="paper-card">
            <h2 className="typewriter-title mb-2 text-lg">Fingerprint</h2>
            <EmotionRadar emotions={emotions} />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/" className="ink-button">
          analyze another
        </Link>
        <Link href="/batch" className="ink-button opacity-70">
          batch upload
        </Link>
      </div>
    </div>
  );
}
