import { useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
function solve(a, b, c) {
  if (a === 0) {
    if (b === 0) {
      return c === 0
        ? { kind: 'identity' }
        : { kind: 'no-solution' };
    }
    return { kind: 'linear', root: -c / b };
  }
  const discriminant = b * b - 4 * a * c;
  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    return {
      kind: 'real-distinct',
      x1: (-b + sqrtD) / (2 * a),
      x2: (-b - sqrtD) / (2 * a),
    };
  }
  if (discriminant === 0) {
    return { kind: 'real-repeated', x: -b / (2 * a) };
  }
  const real = -b / (2 * a);
  const imag = Math.sqrt(-discriminant) / (2 * a);
  return { kind: 'complex', real, imag: Math.abs(imag) };
}
export default function QuadraticEquationSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-3');
  const [c, setC] = useState('2');
  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);
  const invalid = a === '' || b === '' || c === '' || [numA, numB, numC].some(Number.isNaN);
  const result = !invalid ? solve(numA, numB, numC) : null;
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
      {invalid && <div className="tool-error">Enter numeric values for a, b, and c.</div>}
      {result && result.kind === 'identity' && (
        <div className="tool-error">a, b, and c are all 0 - every value of x is a solution.</div>
      )}
      {result && result.kind === 'no-solution' && (
        <div className="tool-error">a and b are both 0 but c is non-zero - there is no solution.</div>
      )}
      {result && result.kind === 'linear' && (
        <div className="timestamp-result">
          <span>a = 0, so this is linear: bx + c = 0</span>
          <strong>x = {formatNum(result.root)}</strong>
        </div>
      )}
      {result && result.kind === 'real-distinct' && (
        <div className="timestamp-result">
          <strong>x₁ = {formatNum(result.x1)}</strong>
          <strong>x₂ = {formatNum(result.x2)}</strong>
        </div>
      )}
      {result && result.kind === 'real-repeated' && (
        <div className="timestamp-result">
          <span>Discriminant is 0 - one repeated real root:</span>
          <strong>x = {formatNum(result.x)}</strong>
        </div>
      )}
      {result && result.kind === 'complex' && (
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
