import { useEffect, useState } from 'react';
const MAX_N = 170;
export default function PermutationsCombinationsCalculator() {
  const [n, setN] = useState('10');
  const [r, setR] = useState('3');
  const [domainError, setDomainError] = useState('');
  const [nPr, setNPr] = useState(null);
  const [nCr, setNCr] = useState(null);
  const [factorialN, setFactorialN] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/permutations-combinations-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { n, r } })
      })
        .then((r2) => r2.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error !== undefined) {
            setDomainError(data.error);
            setNPr(data.nPr);
            setNCr(data.nCr);
            setFactorialN(data.factorialN);
          } else if (data.error) {
            setError(data.error);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [n, r]);
  const result = !domainError && nPr !== null ? { nPr, nCr } : null;
  return (
    <div className="tool-page">
      <h1>Permutations &amp; Combinations Calculator</h1>
      <p className="tool-description">
        Given n and r, compute the number of permutations (nPr) and combinations (nCr) using the
        standard factorial-based formulas. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          n:
          <input type="number" min={0} max={MAX_N} value={n} onChange={(e) => setN(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          r:
          <input type="number" min={0} max={MAX_N} value={r} onChange={(e) => setR(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && domainError && <div className="tool-error">{domainError}</div>}
      {!error && result && (
        <div className="timestamp-result">
          <span>
            <strong>nPr (permutations):</strong> {result.nPr.toLocaleString()}
          </span>
          <span>
            <strong>nCr (combinations):</strong> {result.nCr.toLocaleString()}
          </span>
        </div>
      )}
      {!error && !domainError && factorialN !== null && (
        <p className="tool-placeholder">n! = {factorialN.toLocaleString()}</p>
      )}
    </div>
  );
}
