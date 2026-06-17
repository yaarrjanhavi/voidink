'use client';

import { useEffect, useState } from 'react';
import { GameCompareChart, EmotionDistribution } from '@/components/charts/PlotlyEmotionChart';
import { predictBatch, heuristicPredict } from '@/lib/api-client';

const DEMO_REVIEWS: Record<string, string[]> = {
  OMORI: [
    'A beautiful tragedy about loneliness and facing your past. I cried for hours.',
    'The white space felt so empty and peaceful yet terrifying.',
    'Nostalgic pixel art hiding devastating emotional horror.',
  ],
  'Fran Bow': [
    'Surreal and disturbing. The asylum scenes gave me genuine dread.',
    'Dark humor mixed with body horror and confusion. Unsettling throughout.',
    'I felt anxious the entire playthrough. Something is deeply wrong here.',
  ],
  'Sally Face': [
    'Melancholy metal soundtrack and a lonely protagonist. Haunting.',
    'Curiosity kept me going but the revelations were horrifying.',
    'Comfort in small moments between waves of sadness and fear.',
  ],
};

export default function ExplorePage() {
  const [gameSummaries, setGameSummaries] = useState<
    { name: string; summary: Record<string, number> }[]
  >([]);
  const [globalSummary, setGlobalSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const summaries: { name: string; summary: Record<string, number> }[] = [];

      for (const [name, reviews] of Object.entries(DEMO_REVIEWS)) {
        try {
          const res = await predictBatch(reviews);
          summaries.push({ name, summary: res.summary });
        } catch {
          const fallback = reviews.map((t) => heuristicPredict(t).emotions);
          const sums: Record<string, number> = {};
          fallback.flat().forEach((e) => {
            sums[e.id] = (sums[e.id] ?? 0) + e.probability;
          });
          Object.keys(sums).forEach((k) => {
            sums[k] = sums[k] / reviews.length;
          });
          summaries.push({ name, summary: sums });
        }
      }

      setGameSummaries(summaries);

      const global: Record<string, number> = {};
      summaries.forEach(({ summary }) => {
        Object.entries(summary).forEach(([k, v]) => {
          global[k] = (global[k] ?? 0) + v;
        });
      });
      Object.keys(global).forEach((k) => {
        global[k] = global[k] / summaries.length;
      });
      setGlobalSummary(global);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header className="paper-card">
        <h1 className="typewriter-title text-2xl">Explore</h1>
        <p className="mt-2 text-sm text-ink-ghost">
          Emotion fingerprints across indie horror titles — demo data from curated reviews.
        </p>
      </header>

      {loading ? (
        <div className="paper-card animate-pulse text-center text-ink-ghost">
          mapping emotional terrain...
        </div>
      ) : (
        <>
          <div className="paper-card">
            <h2 className="typewriter-title mb-4 text-lg">Cross-Game Comparison</h2>
            <GameCompareChart games={gameSummaries} />
          </div>

          <div className="paper-card">
            <h2 className="typewriter-title mb-4 text-lg">Average Emotion Profile</h2>
            <EmotionDistribution summary={globalSummary} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {gameSummaries.map(({ name, summary }) => {
              const top = Object.entries(summary).sort((a, b) => b[1] - a[1])[0];
              return (
                <div key={name} className="paper-card">
                  <h3 className="typewriter-title text-lg text-ink-rust">{name}</h3>
                  <p className="mt-2 text-xs text-ink-ghost">
                    dominant:{' '}
                    <span className="text-ink-faded">
                      {top?.[0]} ({((top?.[1] ?? 0) * 100).toFixed(0)}%)
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
