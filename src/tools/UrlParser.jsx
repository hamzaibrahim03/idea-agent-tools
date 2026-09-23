import { useEffect, useState } from 'react';
export default function UrlParser() {
  const [input, setInput] = useState('https://user:pass@example.com:8080/path/to/page?foo=1&bar=two#section');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [agentError, setAgentError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setAgentError('');
      fetch('/api/tools/url-parser', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setAgentError(data.error);
          else {
            setParsed(data.parsed);
            setError(data.error);
          }
        })
        .catch((e) => { if (!cancelled) setAgentError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  return (
    <div className="tool-page">
      <h1>URL Parser</h1>
      <p className="tool-description">
        Paste a URL to break it down into its protocol, host, port, path, query parameters, and
        hash, using the browser's built-in URL parser. Runs entirely in your browser.
      </p>
      {agentError && <div className="agent-error">{agentError}</div>}
      <div className="tool-panel">
        <label htmlFor="url-input">URL</label>
        <input
          id="url-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?query=value#hash"
          spellCheck={false}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {parsed && (
        <>
          <div className="tool-grid">
            <div className="tool-panel">
              <label>Protocol</label>
              <input type="text" value={parsed.protocol} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
              <label>Host</label>
              <input type="text" value={parsed.host} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
              <label>Hostname</label>
              <input type="text" value={parsed.hostname} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
              <label>Port</label>
              <input type="text" value={parsed.port || '(default)'} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
              <label>Pathname</label>
              <input type="text" value={parsed.pathname} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            <div className="tool-panel">
              <label>Hash</label>
              <input type="text" value={parsed.hash || '(none)'} readOnly style={{ fontFamily: 'var(--mono)' }} />
            </div>
            {(parsed.username || parsed.password) && (
              <div className="tool-panel">
                <label>Username / Password</label>
                <input
                  type="text"
                  value={`${parsed.username || '(none)'} / ${parsed.password ? '••••••' : '(none)'}`}
                  readOnly
                  style={{ fontFamily: 'var(--mono)' }}
                />
              </div>
            )}
          </div>
          <div className="tool-panel">
            <label>Query parameters {parsed.params.length === 0 && '(none)'}</label>
            {parsed.params.length > 0 && (
              <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.params.map(([k, v], i) => (
                      <tr key={i}>
                        <td>
                          <code>{k}</code>
                        </td>
                        <td>
                          <code>{v}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
