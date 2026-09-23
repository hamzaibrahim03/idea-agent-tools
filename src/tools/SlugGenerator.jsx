import { useEffect, useState } from 'react';
export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/slug-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, separator } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setSlug(data.slug);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, separator]);
  async function handleCopy() {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Slug Generator</h1>
      <p className="tool-description">
        Convert text into a clean, URL-safe slug - lowercased, accents stripped, and non-alphanumeric
        characters replaced with a separator. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Separator:
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!slug}>
          {copied ? 'Copied!' : 'Copy slug'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="slug-input">Text</label>
        <input
          id="slug-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. My Awesome Blog Post!"
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="slug-output">Slug</label>
        <input id="slug-output" type="text" value={slug} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}
