import { useEffect, useState } from 'react';
const VERSION_NAMES = {
  1: 'Time-based (v1)',
  2: 'DCE Security (v2)',
  3: 'Name-based, MD5 (v3)',
  4: 'Random (v4)',
  5: 'Name-based, SHA-1 (v5)',
  6: 'Reordered time-based (v6)',
  7: 'Unix Epoch time-based (v7)',
  8: 'Custom (v8)'
};
export default function UuidValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/uuid-validator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data.result);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  return (
    <div className="tool-page">
      <h1>UUID Validator</h1>
      <p className="tool-description">
        Paste a string to check whether it's a well-formed UUID, and identify its version and
        variant from the bit pattern. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-panel">
        <label htmlFor="uuid-validate-input">UUID</label>
        <input
          id="uuid-validate-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          spellCheck={false}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {result && !result.formatOk && (
        <div className="tool-error">
          <strong>Invalid:</strong> Not a well-formed UUID (expected 8-4-4-4-12 hex digits, e.g.
          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
        </div>
      )}
      {result && result.formatOk && (
        <div className="timestamp-result">
          <div>
            <strong>Status:</strong> Valid UUID format
          </div>
          <div>
            <strong>Canonical form:</strong> <code>{result.canonical}</code>
          </div>
          <div>
            <strong>Version:</strong>{' '}
            {result.version ? VERSION_NAMES[result.version] : `Unrecognized (digit "${result.versionRaw}")`}
          </div>
          <div>
            <strong>Variant:</strong> {result.variant}
          </div>
          {result.isNilUuid && (
            <div>
              <strong>Note:</strong> This is the Nil UUID (all zeros).
            </div>
          )}
          {result.isMaxUuid && (
            <div>
              <strong>Note:</strong> This is the Max UUID (all Fs).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
