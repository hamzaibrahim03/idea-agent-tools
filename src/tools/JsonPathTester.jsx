import { useEffect, useState } from 'react';
export default function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState('{\n  "store": {\n    "book": [\n      { "title": "Book One", "price": 10 },\n      { "title": "Book Two", "price": 15 }\n    ]\n  }\n}');
  const [path, setPath] = useState('$.store.book[0].title');
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/json-path-tester', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { jsonInput, path } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setMatches(null);
          } else {
            setError('');
            setMatches(data.matches);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [jsonInput, path]);
  const outputText = matches
    ? JSON.stringify(matches.length === 1 ? matches[0] : matches, null, 2)
    : '';
  async function handleCopy() {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>JSONPath Tester</h1>
      <p className="tool-description">
        Paste JSON and a JSONPath-like expression to find matching values. Supports a common
        subset - dot notation, bracket notation, array indices, and wildcards - not the full
        JSONPath spec.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-panel">
        <label htmlFor="jsonpath-expr">Path expression</label>
        <input
          id="jsonpath-expr"
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.book[0].title"
          spellCheck={false}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsonpath-input">JSON</label>
          <textarea
            id="jsonpath-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsonpath-output">
            Matches {matches ? `(${matches.length})` : ''}
          </label>
          <textarea id="jsonpath-output" value={outputText} readOnly spellCheck={false} placeholder="No matches" />
        </div>
      </div>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!outputText}>
          {copied ? 'Copied!' : 'Copy matches'}
        </button>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
