import { useEffect, useState } from 'react';
const QUOTE_OPTIONS = [
  { value: "'", label: "Single quotes (')" },
  { value: '"', label: 'Double quotes (")' },
  { value: '`', label: 'Backticks (`)' }
];
export default function QuoteStyleConverter() {
  const [input, setInput] = useState(`const name = "world";\nconst greeting = 'Hello, ' + name + "!";`);
  const [targetQuote, setTargetQuote] = useState("'");
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setOutput('');
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/quote-style-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, targetQuote } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setOutput(data.output);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, targetQuote]);
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Quote Style Converter</h1>
      <p className="tool-description">
        Convert string quotes in a code snippet to single, double, or backtick style, correctly
        handling quotes already inside strings. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Convert to:
          <select value={targetQuote} onChange={(e) => setTargetQuote(e.target.value)}>
            {QUOTE_OPTIONS.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="quote-input">Input</label>
          <textarea id="quote-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="quote-output">Output</label>
          <textarea id="quote-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
