'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SAMPLE =
  'This game left me feeling hollow for days. The quiet hallways, the sense that something was always watching — I couldn\'t shake the dread. Beautiful and devastating.';

export default function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const analyze = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    sessionStorage.setItem('voidink-review', trimmed);
    router.push('/analyze');
  };

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="paper-card"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-ink-ghost">entry #001</p>
        <h1 className="typewriter-title mb-4 text-3xl text-ink-faded sm:text-4xl">
          What did the review <span className="text-ink-rust">feel</span> like?
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-ghost">
          Paste an indie horror game review. voidink reads beyond positive and negative —
          mapping fear, dread, nostalgia, loneliness, and the quiet emotions games leave behind.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="paper-card"
      >
        <label htmlFor="review" className="typewriter-title mb-3 block text-sm text-ink-ghost">
          the review
        </label>
        <textarea
          id="review"
          className="notebook-input"
          placeholder="Something moved in the corner of my eye..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="ink-button" onClick={analyze} disabled={loading || !text.trim()}>
            {loading ? 'reading...' : 'analyze emotions'}
          </button>
          <button
            type="button"
            className="ink-button opacity-70"
            onClick={() => setText(SAMPLE)}
          >
            try sample
          </button>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { n: '12', label: 'emotions tracked' },
          { n: '∞', label: 'reviews waiting' },
          { n: '0.0–1.0', label: 'confidence scores' },
        ].map((stat) => (
          <div key={stat.label} className="paper-card text-center">
            <p className="typewriter-title text-2xl text-ink-rust">{stat.n}</p>
            <p className="text-xs text-ink-ghost">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
