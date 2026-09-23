import { useEffect, useState } from 'react';
export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setDecoded(null);
        setError('');
        return;
      }
      setFetchError('');
      fetch('/api/tools/jwt-decoder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setDecoded(null);
          } else {
            setError('');
            setDecoded(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  return (
    <div className="tool-page">
      <h1>JWT Decoder</h1>
      <p className="tool-description">
        Paste a JSON Web Token to inspect its header and payload. The signature is not verified.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-panel">
        <label htmlFor="jwt-input">Token</label>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOi..."
          spellCheck={false}
          style={{ minHeight: 100 }}
        />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Decode error:</strong> {error}
        </div>
      )}
      {decoded && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label>Header</label>
            <textarea readOnly value={JSON.stringify(decoded.header, null, 2)} spellCheck={false} />
          </div>
          <div className="tool-panel">
            <label>Payload</label>
            <textarea readOnly value={JSON.stringify(decoded.payload, null, 2)} spellCheck={false} />
          </div>
        </div>
      )}
    </div>
  );
}
