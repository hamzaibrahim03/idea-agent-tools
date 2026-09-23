import { useEffect, useState } from 'react';
export default function TextWrapper() {
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(80);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-wrapper', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, width } })
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
  }, [input, width]);
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
      <h1>Text Wrapper</h1>
      <p className="tool-description">
        Wrap plain text to a fixed line width, breaking on word boundaries. Only words longer than
        the wrap width itself get broken mid-word. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Wrap width:
          <input
            type="number"
            min="1"
            max="500"
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="wrap-input">Input</label>
          <textarea
            id="wrap-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="wrap-output">Wrapped output</label>
          <textarea id="wrap-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
