import Papa from 'papaparse';

export interface ReviewRow {
  text: string;
  game_title?: string;
  [key: string]: string | undefined;
}

export function parseReviewCsv(file: File): Promise<ReviewRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ReviewRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.filter((r) => r.text?.trim());
        if (rows.length === 0) {
          reject(new Error('No reviews found. CSV must have a "text" column.'));
          return;
        }
        resolve(rows);
      },
      error: (err) => reject(err),
    });
  });
}

export function exportResultsCsv(
  rows: ReviewRow[],
  results: { emotions: { id: string; probability: number }[] }[]
): string {
  const emotionIds = results[0]?.emotions.map((e) => e.id) ?? [];
  const headers = ['text', 'game_title', ...emotionIds.map((id) => `prob_${id}`)];
  const lines = [headers.join(',')];

  rows.forEach((row, i) => {
    const probs = Object.fromEntries(
      results[i].emotions.map((e) => [e.id, e.probability.toFixed(4)])
    );
    const cells = [
      `"${(row.text ?? '').replace(/"/g, '""')}"`,
      `"${(row.game_title ?? '').replace(/"/g, '""')}"`,
      ...emotionIds.map((id) => probs[id] ?? '0'),
    ];
    lines.push(cells.join(','));
  });

  return lines.join('\n');
}
