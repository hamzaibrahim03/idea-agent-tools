import { useState } from 'react';
function diffLines(a, b) {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const m = linesA.length, n = linesB.length;
  const lcs = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = linesA[i] === linesB[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const result = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: 'same', text: linesA[i] });
      i++; j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: 'removed', text: linesA[i] });
      i++;
    } else {
      result.push({ type: 'added', text: linesB[j] });
      j++;
    }
  }
  while (i < m) { result.push({ type: 'removed', text: linesA[i] }); i++; }
  while (j < n) { result.push({ type: 'added', text: linesB[j] }); j++; }
  return result;
}
export default function DiffChecker() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const diff = left || right ? diffLines(left, right) : [];
  return (
    <div className="tool-page">
      <h1>Text Diff Checker</h1>
      <p className="tool-description">
        Compare two blocks of text and see line-by-line differences highlighted. Runs entirely
        in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="diff-left">Original</label>
          <textarea id="diff-left" value={left} onChange={(e) => setLeft(e.target.value)} spellCheck={false} placeholder="Paste original text" />
        </div>
        <div className="tool-panel">
          <label htmlFor="diff-right">Changed</label>
          <textarea id="diff-right" value={right} onChange={(e) => setRight(e.target.value)} spellCheck={false} placeholder="Paste changed text" />
        </div>
      </div>
      {diff.length > 0 && (
        <div className="regex-highlighted">
          {diff.map((line, idx) => (
            <div
              key={idx}
              style={{
                background:
                  line.type === 'added' ? 'rgba(34,197,94,0.15)' : line.type === 'removed' ? 'rgba(220,38,38,0.12)' : 'transparent',
                color: line.type === 'added' ? '#16a34a' : line.type === 'removed' ? '#dc2626' : 'inherit'
              }}
            >
              {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
              {line.text || ' '}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
