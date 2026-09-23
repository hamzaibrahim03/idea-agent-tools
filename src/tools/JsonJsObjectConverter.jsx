import { useEffect, useState } from 'react';
export default function JsonJsObjectConverter() {
  const [mode, setMode] = useState('json-to-js');
  const [input, setInput] = useState('{\n  "name": "example",\n  "count": 2,\n  "tags": ["a", "b"]\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      setFetchError('');
      fetch('/api/tools/json-js-object-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { mode, input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setOutput('');
          } else {
            setError('');
            setOutput(data.output || '');
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [mode, input]);
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
      <h1>JSON ⇄ JS Object Literal Converter</h1>
      <p className="tool-description">
        Convert JSON to a JS object literal (unquoted keys, single quotes) for pasting into
        source code, or back.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Direction:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="json-to-js">JSON to JS object</option>
            <option value="js-to-json">JS object to JSON</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsobj-input">{mode === 'json-to-js' ? 'JSON input' : 'JS object input'}</label>
          <textarea id="jsobj-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsobj-output">{mode === 'json-to-js' ? 'JS object output' : 'JSON output'}</label>
          <textarea id="jsobj-output" value={output} readOnly spellCheck={false} />
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
