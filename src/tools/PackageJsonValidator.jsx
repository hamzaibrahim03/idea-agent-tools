import { useEffect, useState } from 'react';
const SAMPLE = `{
  "name": "my-package",
  "version": "1.0.0",
  "description": "An example package",
  "main": "index.js",
  "license": "MIT"
}`;
export default function PackageJsonValidator() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/package-json-validator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) { setError(data.error); }
          else {
            setIssues(data.issues || []);
            setWarnings(data.warnings || []);
            setParsed(data.parsed || null);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  const isValid = input.trim() && issues.length === 0;
  return (
    <div className="tool-page">
      <h1>package.json Validator</h1>
      <p className="tool-description">
        Paste a package.json file to check for valid JSON, required fields ("name"/"version"), npm
        naming rules, and a valid semantic version. This is a basic sanity checker, not a full
        npm-registry-level validator. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={() => setInput(SAMPLE)}>Load sample</button>
        <button onClick={() => setInput('')} disabled={!input}>Clear</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="pkg-input">package.json content</label>
        <textarea
          id="pkg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your package.json content here"
          spellCheck={false}
          style={{ minHeight: 220 }}
        />
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && input.trim() && (
        <div className="timestamp-result">
          <span>
            <strong>Status:</strong>{' '}
            {isValid ? 'Looks structurally valid' : `${issues.length} issue(s) found`}
          </span>
          {parsed && (
            <span>
              <strong>Name / Version:</strong> {parsed.name || '—'} / {parsed.version || '—'}
            </span>
          )}
        </div>
      )}
      {!error && issues.length > 0 && (
        <div className="tool-error">
          <strong>Issues:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {!error && warnings.length > 0 && (
        <div className="tool-panel">
          <label>Warnings</label>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, opacity: 0.85 }}>
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
