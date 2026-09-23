import { useEffect, useState } from 'react';
export default function TextDiffPercentage() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [percent, setPercent] = useState(0);
  const [hasInput, setHasInput] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-diff-percentage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { left, right } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setPercent(data.percent);
            setHasInput(data.hasInput);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [left, right]);
  return (
    <div className="tool-page">
      <h1>Text Diff Percentage</h1>
      <p className="tool-description">
        Compare two blocks of text and get an overall similarity percentage, based on the longest
        common subsequence of characters between them. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="tdp-left">Text A</label>
          <textarea id="tdp-left" value={left} onChange={(e) => setLeft(e.target.value)} spellCheck={false} placeholder="Paste first text" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tdp-right">Text B</label>
          <textarea id="tdp-right" value={right} onChange={(e) => setRight(e.target.value)} spellCheck={false} placeholder="Paste second text" />
        </div>
      </div>
      {hasInput && (
        <div className="timestamp-result">
          <span>
            <strong>Similarity:</strong> {percent.toFixed(1)}%
          </span>
          <span>
            This is based on the longest shared sequence of characters between the two texts
            (2 &times; shared length &divide; combined length). 100% means identical text, 0%
            means no characters in common order; it does not measure meaning, only character-level
            overlap.
          </span>
        </div>
      )}
    </div>
  );
}
