import { useEffect, useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
export default function QuadraticEquationSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-3');
  const [c, setC] = useState('2');
  const [invalid, setInvalid] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/quadratic-equation-solver', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { a, b, c } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setInvalid(data.invalid);
            setResult(data.result);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [a, b, c]);
  return (
    <div className="tool-page">
      <h1>Quadratic Equation Solver</h1>
      <p className="tool-description">
        Solve ax² + bx + c = 0 for x using the quadratic formula, including complex roots when the
        discriminant is negative. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          a:
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          b:
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          c:
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} style={{ width: '80px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && invalid && <div className="tool-error">Enter numeric values for a, b, and c.</div>}
      {!error && result && result.kind === 'identity' && (
        <div className="tool-error">a, b, and c are all 0 - every value of x is a solution.</div>
      )}
      {!error && result && result.kind === 'no-solution' && (
        <div className="tool-error">a and b are both 0 but c is non-zero - there is no solution.</div>
      )}
      {!error && result && result.kind === 'linear' && (
        <div className="timestamp-result">
          <span>a = 0, so this is linear: bx + c = 0</span>
          <strong>x = {formatNum(result.root)}</strong>
        </div>
      )}
      {!error && result && result.kind === 'real-distinct' && (
        <div className="timestamp-result">
          <strong>x₁ = {formatNum(result.x1)}</strong>
          <strong>x₂ = {formatNum(result.x2)}</strong>
        </div>
      )}
      {!error && result && result.kind === 'real-repeated' && (
        <div className="timestamp-result">
          <span>Discriminant is 0 - one repeated real root:</span>
          <strong>x = {formatNum(result.x)}</strong>
        </div>
      )}
      {!error && result && result.kind === 'complex' && (
        <div className="timestamp-result">
          <span>No real roots - discriminant is negative. Complex roots:</span>
          <strong>
            x = {formatNum(result.real)} ± {formatNum(result.imag)}i
          </strong>
        </div>
      )}
    </div>
  );
}
