'use client';

import dynamic from 'next/dynamic';
import type { EmotionScore } from '@/lib/emotions';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  emotions: EmotionScore[];
  title?: string;
}

const paperBg = '#2a2420';
const plotFont = { family: 'Courier Prime, monospace', color: '#c4b8a8', size: 11 };

export function EmotionRadar({ emotions, title }: Props) {
  const sorted = [...emotions].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Plot
      data={[
        {
          type: 'scatterpolar',
          r: sorted.map((e) => e.probability),
          theta: sorted.map((e) => e.label),
          fill: 'toself',
          fillcolor: 'rgba(139, 58, 47, 0.15)',
          line: { color: '#8b3a2f', width: 2, dash: 'dot' },
          marker: { color: sorted.map((e) => e.color), size: 6 },
          name: 'Emotions',
        },
      ]}
      layout={{
        title: title ? { text: title, font: { ...plotFont, size: 13 } } : undefined,
        paper_bgcolor: paperBg,
        plot_bgcolor: paperBg,
        polar: {
          bgcolor: '#1f1b18',
          radialaxis: {
            visible: true,
            range: [0, 1],
            tickfont: plotFont,
            gridcolor: '#3d3530',
            linecolor: '#4a4038',
          },
          angularaxis: {
            tickfont: plotFont,
            gridcolor: '#3d3530',
            linecolor: '#4a4038',
          },
        },
        margin: { t: title ? 40 : 20, b: 20, l: 40, r: 40 },
        showlegend: false,
        font: plotFont,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
      style={{ width: '100%', minHeight: 360 }}
    />
  );
}

interface DistributionProps {
  summary: Record<string, number>;
  title?: string;
}

export function EmotionDistribution({ summary, title }: DistributionProps) {
  const ids = Object.keys(summary);
  const values = ids.map((id) => summary[id]);
  const labels = ids.map((id) => id.charAt(0).toUpperCase() + id.slice(1));

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: labels,
          y: values,
          marker: {
            color: values.map((v) => `rgba(139, 58, 47, ${0.3 + v * 0.7})`),
            line: { color: '#8b3a2f', width: 1 },
          },
        },
      ]}
      layout={{
        title: title ? { text: title, font: { ...plotFont, size: 13 } } : undefined,
        paper_bgcolor: paperBg,
        plot_bgcolor: '#1f1b18',
        xaxis: { tickfont: plotFont, gridcolor: '#3d3530' },
        yaxis: {
          tickfont: plotFont,
          gridcolor: '#3d3530',
          range: [0, 1],
          title: { text: 'Mean probability', font: plotFont },
        },
        margin: { t: title ? 40 : 20, b: 80, l: 50, r: 20 },
        font: plotFont,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
      style={{ width: '100%', minHeight: 320 }}
    />
  );
}

interface CompareProps {
  games: { name: string; summary: Record<string, number> }[];
}

export function GameCompareChart({ games }: CompareProps) {
  const emotionIds = ['dread', 'fear', 'sadness', 'loneliness', 'nostalgia', 'melancholy'];

  return (
    <Plot
      data={games.map((game, i) => ({
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: game.name,
        x: emotionIds.map((id) => id.charAt(0).toUpperCase() + id.slice(1)),
        y: emotionIds.map((id) => game.summary[id] ?? 0),
        line: {
          color: ['#8b3a2f', '#4a6670', '#6b7f6b', '#5d5a6d'][i % 4],
          width: 2,
          dash: 'dot',
        },
        marker: { size: 7 },
      }))}
      layout={{
        paper_bgcolor: paperBg,
        plot_bgcolor: '#1f1b18',
        xaxis: { tickfont: plotFont, gridcolor: '#3d3530' },
        yaxis: {
          tickfont: plotFont,
          gridcolor: '#3d3530',
          range: [0, 1],
          title: { text: 'Probability', font: plotFont },
        },
        legend: { font: plotFont, bgcolor: 'rgba(0,0,0,0)' },
        margin: { t: 20, b: 60, l: 50, r: 20 },
        font: plotFont,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
      style={{ width: '100%', minHeight: 360 }}
    />
  );
}
