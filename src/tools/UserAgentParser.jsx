import { useEffect, useState } from 'react';
const SAMPLE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
export default function UserAgentParser() {
  const [input, setInput] = useState(SAMPLE_UA);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/user-agent-parser', {
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
      <h1>User-Agent Parser</h1>
      <p className="tool-description">
        Paste a User-Agent string to extract the browser name/version, operating system, and
        device type. This uses heuristic regex pattern matching against common UA string formats
        (Chrome, Firefox, Safari, Edge, and common mobile patterns) - it is not a full,
        authoritative UA database and can be wrong on unusual or spoofed strings. Runs entirely in
        your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={() => setInput(navigator.userAgent)}>Use my browser's UA</button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="ua-input">User-Agent string</label>
        <textarea
          id="ua-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a User-Agent string here"
          spellCheck={false}
          style={{ minHeight: '100px' }}
        />
      </div>
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Browser:</strong> {result.browser} {result.browserVersion}
          </div>
          <div>
            <strong>Operating system:</strong> {result.os} {result.osVersion}
          </div>
          <div>
            <strong>Device type:</strong> {result.deviceType}
          </div>
        </div>
      )}
    </div>
  );
}
