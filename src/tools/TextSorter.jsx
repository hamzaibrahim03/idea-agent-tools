import { useEffect, useState } from 'react';
export default function TextSorter() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState('asc');
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [dedupe, setDedupe] = useState(false);
  const [natural, setNatural] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-sorter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, direction, caseInsensitive, dedupe, natural } })
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
  }, [input, direction, caseInsensitive, dedupe, natural]);
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
      <h1>Text Sorter</h1>
      <p className="tool-description">
        Paste multi-line text and sort the lines alphabetically, with optional case-insensitive,
        duplicate-removal, and natural (numeric-aware) sorting. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Direction:
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={caseInsensitive} onChange={() => setCaseInsensitive((v) => !v)} />
          Case-insensitive
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={dedupe} onChange={() => setDedupe((v) => !v)} />
          Remove duplicate lines
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={natural} onChange={() => setNatural((v) => !v)} />
          Natural sort (item2 before item10)
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sort-input">Input</label>
          <textarea id="sort-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sort-output">Sorted output</label>
          <textarea id="sort-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
