import { useEffect, useState } from 'react';
export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setFormatted('');
        setError('');
        return;
      }
      setFetchError('');
      fetch('/api/tools/json-formatter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, indent } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setFormatted('');
          } else {
            setError('');
            setFormatted(data.formatted || '');
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, indent]);
  async function handleMinify() {
    if (!input.trim()) return;
    try {
      const r = await fetch('/api/tools/json-formatter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, indent: 0 } })
      });
      const data = await r.json();
      if (!data.error && data.formatted) setInput(data.formatted);
    } catch {
    }
  }
  async function handleCopy() {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>JSON Formatter &amp; Validator</h1>
      <p className="tool-description">
        Paste JSON to format, validate, and minify it.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Indent:
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tab</option>
          </select>
        </label>
        <button onClick={handleMinify} disabled={!input.trim()}>
          Minify
        </button>
        <button onClick={handleCopy} disabled={!formatted}>
          {copied ? 'Copied!' : 'Copy formatted'}
        </button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="json-input">Input</label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "paste your JSON here"}'
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="json-output">
            Output {error && <span className="tool-error-inline">Invalid JSON</span>}
          </label>
          <textarea id="json-output" value={formatted} readOnly spellCheck={false} placeholder="Formatted JSON will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Parse error:</strong> {error}
        </div>
      )}
    </div>
  );
}
