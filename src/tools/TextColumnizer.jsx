import { useEffect, useState } from 'react';
export default function TextColumnizer() {
  const [input, setInput] = useState('');
  const [columnCount, setColumnCount] = useState(3);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-columnizer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, columnCount } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setOutput(data.output);
            setItemCount(data.itemCount);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, columnCount]);
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
      <h1>Text Columnizer</h1>
      <p className="tool-description">
        Paste a list of items, one per line, and arrange them into evenly-sized columns for
        display or printing. Columns are aligned with padding for a clean monospace layout. Runs
        entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Columns:
          <input
            type="number"
            min={1}
            max={12}
            value={columnCount}
            onChange={(e) => setColumnCount(e.target.value)}
            style={{ width: '60px' }}
          />
        </label>
        <span className="tool-placeholder">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="col-input">Input (one item per line)</label>
          <textarea id="col-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder={'Apple\nBanana\nCherry\nDate'} />
        </div>
        <div className="tool-panel">
          <label htmlFor="col-output">Columnized output</label>
          <textarea id="col-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
