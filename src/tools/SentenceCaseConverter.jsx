import { useEffect, useState } from 'react';
export default function SentenceCaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/sentence-case-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
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
  }, [input]);
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
      <h1>Sentence Case Converter</h1>
      <p className="tool-description">
        Convert text so each sentence starts with a capital letter and the rest is lowercase,
        splitting on ".", "!", and "?" boundaries. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sc-input">Input</label>
          <textarea id="sc-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="type text however YOU want. it will be fixed." />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-output">Sentence case output</label>
          <textarea id="sc-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
