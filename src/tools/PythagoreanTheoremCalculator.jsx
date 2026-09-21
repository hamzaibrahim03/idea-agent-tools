import { useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
export default function PythagoreanTheoremCalculator() {
  const [solveFor, setSolveFor] = useState('c');
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('5');
  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);
  let result = null;
  let error = '';
  if (solveFor === 'c') {
    if (a === '' || b === '' || Number.isNaN(numA) || Number.isNaN(numB) || numA <= 0 || numB <= 0) {
      error = 'Enter positive numbers for a and b.';
    } else {
      result = Math.sqrt(numA * numA + numB * numB);
    }
  } else if (solveFor === 'a') {
    if (b === '' || c === '' || Number.isNaN(numB) || Number.isNaN(numC) || numB <= 0 || numC <= 0) {
      error = 'Enter positive numbers for b and c.';
    } else if (numC <= numB) {
      error = 'The hypotenuse c must be longer than leg b.';
    } else {
      result = Math.sqrt(numC * numC - numB * numB);
    }
  } else {
    if (a === '' || c === '' || Number.isNaN(numA) || Number.isNaN(numC) || numA <= 0 || numC <= 0) {
      error = 'Enter positive numbers for a and c.';
    } else if (numC <= numA) {
      error = 'The hypotenuse c must be longer than leg a.';
    } else {
      result = Math.sqrt(numC * numC - numA * numA);
    }
  }
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
      {error && <div className="tool-error">{error}</div>}
      {result !== null && !error && (
        <div className="timestamp-result">
          <strong>{solveFor} = {formatNum(result)}</strong>
        </div>
      )}
    </div>
  );
}
