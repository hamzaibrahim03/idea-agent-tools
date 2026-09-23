import { useMemo, useState } from 'react';
function lcsLength(a, b) {
  const m = a.length, n = b.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}
function similarity(a, b) {
  if (a.length === 0 && b.length === 0) return 100;
  const lcs = lcsLength(a, b);
  return (2 * lcs / (a.length + b.length)) * 100;
}
export default function TextDiffPercentage() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const percent = useMemo(() => similarity(left, right), [left, right]);
  const hasInput = left.length > 0 || right.length > 0;
  return (
    <div className="tool-page">
      <h1>Text Diff Percentage</h1>
      <p className="tool-description">
        Compare two blocks of text and get an overall similarity percentage, based on the longest
        common subsequence of characters between them. Runs entirely in your browser.
      </p>
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
