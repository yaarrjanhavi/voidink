import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="paper-card">
        <h1 className="typewriter-title text-2xl">About voidink</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-ghost">
          voidink analyzes indie horror game reviews and detects complex emotions beyond
          simple positive/negative sentiment — fear, dread, nostalgia, loneliness, and more.
        </p>
      </header>

      <section className="paper-card space-y-4">
        <h2 className="typewriter-title text-lg">Architecture</h2>
        <pre className="overflow-x-auto rounded-sm bg-[#1a1614] p-4 text-xs text-ink-ghost">
{`Data Sources → Preprocessing → Multi-label Models → FastAPI → Next.js (Vercel)

Sources: Steam, Reddit, Kaggle, review sites
Models:  TF-IDF + Logistic Regression, DistilBERT, BERT, RoBERTa
Output:  12 emotion probabilities per review`}
        </pre>
      </section>

      <section className="paper-card">
        <h2 className="typewriter-title mb-4 text-lg">Model Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3d3530] text-ink-ghost">
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Macro F1</th>
                <th className="py-2 pr-4">Latency</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="text-ink-faded">
              <tr className="border-b border-[#3d3530]/50">
                <td className="py-2 pr-4">TF-IDF + LogReg</td>
                <td className="py-2 pr-4">baseline</td>
                <td className="py-2 pr-4">~1ms</td>
                <td className="py-2">Fast, interpretable</td>
              </tr>
              <tr className="border-b border-[#3d3530]/50">
                <td className="py-2 pr-4">DistilBERT</td>
                <td className="py-2 pr-4">TBD</td>
                <td className="py-2 pr-4">~40ms</td>
                <td className="py-2">Production candidate</td>
              </tr>
              <tr className="border-b border-[#3d3530]/50">
                <td className="py-2 pr-4">RoBERTa</td>
                <td className="py-2 pr-4">TBD</td>
                <td className="py-2 pr-4">~60ms</td>
                <td className="py-2">Highest accuracy expected</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Heuristic</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">instant</td>
                <td className="py-2">Offline fallback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="paper-card">
        <h2 className="typewriter-title mb-3 text-lg">Dataset</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-ink-ghost">
          <li>Steam reviews via public Store API</li>
          <li>Reddit discussions (r/horrorgaming, game-specific subs)</li>
          <li>Kaggle game review corpora</li>
          <li>Curated indie horror titles: OMORI, Fran Bow, Sally Face, and more</li>
        </ul>
        <p className="mt-3 text-xs text-ink-ghost">
          See <code>docs/dataset.md</code> in the repository for full details.
        </p>
      </section>

      <section className="paper-card">
        <h2 className="typewriter-title mb-3 text-lg">Future Enhancements</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-ink-ghost">
          <li>Domain-adapted transformer fine-tuned on horror reviews</li>
          <li>Sentence-level emotion trajectories</li>
          <li>Game similarity map via emotion embeddings</li>
          <li>Attention-based explainability</li>
          <li>Multilingual support</li>
        </ul>
      </section>

      <Link href="/" className="ink-button inline-block">
        back to writing
      </Link>
    </div>
  );
}
