import { useMemo, useState } from 'react';
const PLATFORMS = [
  { key: 'twitter', label: 'Twitter / X post', limit: 280 },
  { key: 'metaTitle', label: 'Meta title (SEO)', limit: 60 },
  { key: 'metaDescription', label: 'Meta description (SEO)', limit: 160 }
];
function smsSegments(length) {
  if (length === 0) return 0;
  if (length <= 160) return 1;
  return Math.ceil(length / 153);
}
function analyze(text) {
  const length = text.length;
  const platforms = PLATFORMS.map((p) => ({
    ...p,
    remaining: p.limit - length,
    over: length > p.limit
  }));
  const segments = smsSegments(length);
  return { length, platforms, segments };
}
export default function CharacterCounterLimits() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => analyze(input), [input]);
  return (
    <div className="tool-page">
      <h1>Character Counter with Platform Limits</h1>
      <p className="tool-description">
        Type or paste text to see a live character count against common platform limits - Twitter/X
        posts, SMS segments, and meta title/description SEO guidance. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="char-limit-input">Text</label>
        <textarea
          id="char-limit-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here"
          style={{ minHeight: 200 }}
        />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Total characters:</strong> {stats.length}
        </span>
        {stats.platforms.map((p) => (
          <span key={p.key}>
            <strong>{p.label} ({p.limit}):</strong>{' '}
            {p.over ? `${Math.abs(p.remaining)} over the limit` : `${p.remaining} remaining`}
            {p.over && <span className="tool-error-inline">Over limit</span>}
          </span>
        ))}
        <span>
          <strong>SMS segments (160 chars/segment, 153/segment simplified multipart rule):</strong>{' '}
          {stats.segments || 0}
        </span>
      </div>
    </div>
  );
}
