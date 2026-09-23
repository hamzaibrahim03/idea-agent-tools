import { useEffect, useState } from 'react';
export default function PlainTextFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setOutput('');
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/plain-text-formatter', {
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
      <h1>Plain Text Formatter</h1>
      <p className="tool-description">
        Paste text with messy line breaks and spacing - like text copied from a PDF with awkward
        line wraps - and clean it up: hard line breaks within a paragraph are removed while
        paragraph breaks (blank lines) are preserved, and extra whitespace is normalized. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>{copied ? 'Copied!' : 'Copy cleaned text'}</button>
        <button onClick={() => setInput('')} disabled={!input}>Clear</button>
      </div>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ptf-input">Input (messy text)</label>
          <textarea
            id="ptf-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with odd line wraps here"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="ptf-output">Output (cleaned)</label>
          <textarea id="ptf-output" value={output} readOnly spellCheck={false} placeholder="Cleaned text will appear here" />
        </div>
      </div>
    </div>
  );
}
