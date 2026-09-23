import { useEffect, useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
export default function PythagoreanTheoremCalculator() {
  const [solveFor, setSolveFor] = useState('c');
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('5');
  const [result, setResult] = useState(null);
  const [domainError, setDomainError] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/pythagorean-theorem-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { solveFor, a, b, c } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setResult(data.result);
            setDomainError(data.domainError);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [solveFor, a, b, c]);
  return (
    <div className="tool-page">
      <h1>Pythagorean Theorem Calculator</h1>
      <p className="tool-description">
        Given any two sides of a right triangle, solve for the third using a² + b² = c². Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Solve for:
          <select value={solveFor} onChange={(e) => setSolveFor(e.target.value)}>
            <option value="c">c (hypotenuse)</option>
            <option value="a">a (leg)</option>
            <option value="b">b (leg)</option>
          </select>
        </label>
      </div>
      <div className="tool-controls">
        {solveFor !== 'a' && (
          <label>
            a:
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} style={{ width: '90px' }} />
          </label>
        )}
        {solveFor !== 'b' && (
          <label>
            b:
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} style={{ width: '90px' }} />
          </label>
        )}
        {solveFor !== 'c' && (
          <label>
            c:
            <input type="number" value={c} onChange={(e) => setC(e.target.value)} style={{ width: '90px' }} />
          </label>
        )}
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && domainError && <div className="tool-error">{domainError}</div>}
      {!error && result !== null && !domainError && (
        <div className="timestamp-result">
          <strong>{solveFor} = {formatNum(result)}</strong>
        </div>
      )}
    </div>
  );
}
