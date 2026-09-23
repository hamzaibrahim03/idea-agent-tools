import { useEffect, useState } from 'react';
export default function TextToUpperLowerAlternating() {
  const [input, setInput] = useState('');
  const [startUpper, setStartUpper] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-to-upper-lower-alternating', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, startUpper } })
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
  }, [input, startUpper]);
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
      <h1>Alternating Case Converter</h1>
      <p className="tool-description">
        Convert text to aLtErNaTiNg CaSe (aka "sPoNgEbOb case") by flipping upper/lower case for
        each letter, skipping spaces and punctuation. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={startUpper} onChange={() => setStartUpper((v) => !v)} />
          Start with uppercase
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="alt-input">Text</label>
          <textarea
            id="alt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="alt-output">Alternating case</label>
          <textarea id="alt-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
