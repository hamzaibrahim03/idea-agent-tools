import { useEffect, useState } from 'react';
export default function RatioCalculator() {
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [c, setC] = useState('10');
  const [d, setD] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/ratio-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { a, b, c, d } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [a, b, c, d]);
  const valid = result?.valid ?? false;
  const solved = result?.solved ?? null;
  const solvedField = result?.solvedField ?? null;
  const simplified = result?.simplified ?? null;
  return (
    <div className="tool-page">
      <h1>Ratio &amp; Proportion Solver</h1>
      <p className="tool-description">
        Simplify a ratio to lowest terms, or solve a proportion (a:b = c:d) by leaving exactly one
        of the four values blank. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="a" style={{ width: '70px' }} />
        <span>:</span>
        <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="b" style={{ width: '70px' }} />
        <span>=</span>
        <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="c" style={{ width: '70px' }} />
        <span>:</span>
        <input type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="d (leave blank to solve)" style={{ width: '130px' }} />
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!valid && (
        <div className="tool-error">
          <strong>Note:</strong> Leave exactly one of the four fields blank to solve the proportion.
        </div>
      )}
      {solved !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Solved value ({solvedField}):</strong> {Number.isFinite(solved) ? solved.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') : 'undefined (division by zero)'}
          </div>
        </div>
      )}
      {simplified && (
        <div className="timestamp-result">
          <div>
            <strong>a:b simplified:</strong> {simplified}
          </div>
        </div>
      )}
    </div>
  );
}
