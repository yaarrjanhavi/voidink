'use client';

import { useState } from 'react';
import { EmotionDistribution } from '@/components/charts/PlotlyEmotionChart';
import { EmotionBars } from '@/components/emotion/EmotionBars';
import { heuristicPredict, predictBatch } from '@/lib/api-client';
import { exportResultsCsv, parseReviewCsv, type ReviewRow } from '@/lib/csv-parser';
import type { EmotionScore } from '@/lib/emotions';

export default function BatchPage() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [results, setResults] = useState<EmotionScore[][]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    try {
      const parsed = await parseReviewCsv(file);
      setRows(parsed);
      setResults([]);
      setSummary({});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV');
    }
  };

  const runBatch = async () => {
    if (rows.length === 0) return;
    setLoading(true);
    setError('');
    const texts = rows.map((r) => r.text);

    try {
      const res = await predictBatch(texts);
      setResults(res.results);
      setSummary(res.summary);
      setModel(res.model);
    } catch {
      const fallback = texts.map((t) => heuristicPredict(t).emotions);
      setResults(fallback);
      const sums: Record<string, number> = {};
      fallback.flat().forEach((e) => {
        sums[e.id] = (sums[e.id] ?? 0) + e.probability;
      });
      Object.keys(sums).forEach((k) => {
        sums[k] = sums[k] / texts.length;
      });
      setSummary(sums);
      setModel('heuristic-fallback (offline)');
      setError('API unavailable — using local heuristic fallback.');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const csv = exportResultsCsv(
      rows,
      results.map((emotions) => ({ emotions }))
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voidink_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="paper-card">
        <h1 className="typewriter-title text-2xl">Batch Analysis</h1>
        <p className="mt-2 text-sm text-ink-ghost">
          Upload a CSV with a <code className="text-ink-rust">text</code> column and optional{' '}
          <code className="text-ink-rust">game_title</code>.
        </p>
      </header>

      <div className="paper-card">
        <input
          type="file"
          accept=".csv"
          className="block w-full text-sm text-ink-ghost file:mr-4 file:border file:border-[#4a4038] file:bg-[#1f1b18] file:px-4 file:py-2 file:text-ink-faded"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {rows.length > 0 && (
          <p className="mt-3 text-xs text-ink-ghost">{rows.length} reviews loaded</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="ink-button"
            onClick={runBatch}
            disabled={loading || rows.length === 0}
          >
            {loading ? 'analyzing...' : 'run analysis'}
          </button>
          {results.length > 0 && (
            <button type="button" className="ink-button opacity-70" onClick={download}>
              download results
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-ink-rust">{error}</p>}
        {model && <p className="mt-1 text-xs text-ink-ghost">model: {model}</p>}
      </div>

      {results.length > 0 && (
        <>
          <div className="paper-card">
            <h2 className="typewriter-title mb-4 text-lg">Distribution</h2>
            <EmotionDistribution summary={summary} />
          </div>

          <div className="space-y-4">
            <h2 className="typewriter-title text-lg">Individual Results</h2>
            {results.slice(0, 5).map((emotions, i) => (
              <div key={i} className="paper-card">
                <p className="mb-2 text-xs text-ink-ghost">
                  {rows[i]?.game_title ? `${rows[i].game_title} — ` : ''}
                  review #{i + 1}
                </p>
                <p className="mb-3 line-clamp-2 text-sm italic text-ink-faded">
                  &ldquo;{rows[i]?.text}&rdquo;
                </p>
                <EmotionBars emotions={emotions} threshold={0.15} />
              </div>
            ))}
            {results.length > 5 && (
              <p className="text-center text-xs text-ink-ghost">
                + {results.length - 5} more in download
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
