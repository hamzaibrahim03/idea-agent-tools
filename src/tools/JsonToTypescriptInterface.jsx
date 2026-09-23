import { useEffect, useState } from 'react';
export default function JsonToTypescriptInterface() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "active": true,\n  "tags": ["admin", "user"],\n  "address": {\n    "city": "London",\n    "zip": "SW1"\n  }\n}');
  const [rootName, setRootName] = useState('Root');
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
      fetch('/api/tools/json-to-typescript-interface', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, rootName } })
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
  }, [input, rootName]);
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
      <h1>JSON to TypeScript Interface</h1>
      <p className="tool-description">
        Paste JSON to generate a matching TypeScript interface definition. Types are inferred from
        the values present, including nested objects (as separate interfaces) and arrays.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Root interface name:
          <input type="text" value={rootName} onChange={(e) => setRootName(e.target.value)} style={{ width: '140px' }} />
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsts-input">JSON input</label>
          <textarea
            id="jsts-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "paste your JSON here"}'
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsts-output">
            TypeScript output {error && <span className="tool-error-inline">Invalid JSON</span>}
          </label>
          <textarea id="jsts-output" value={output} readOnly spellCheck={false} placeholder="Generated interfaces will appear here" />
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
