import { useState } from 'react';
const MAX_N = 170;
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
function permutations(n, r) {
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return result;
}
function combinations(n, r) {
  const rSmall = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < rSmall; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}
export default function PermutationsCombinationsCalculator() {
  const [n, setN] = useState('10');
  const [r, setR] = useState('3');
  const numN = Number(n);
  const numR = Number(r);
  let error = '';
  if (n === '' || r === '') {
    error = 'Enter values for n and r.';
  } else if (!Number.isInteger(numN) || !Number.isInteger(numR)) {
    error = 'n and r must be whole numbers.';
  } else if (numN < 0 || numR < 0) {
    error = 'n and r must be non-negative.';
  } else if (numR > numN) {
    error = 'r cannot be greater than n.';
  } else if (numN > MAX_N) {
    error = `n is capped at ${MAX_N} to avoid exceeding floating-point precision.`;
  }
  const result = !error ? { nPr: permutations(numN, numR), nCr: combinations(numN, numR) } : null;
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
      {error && <div className="tool-error">{error}</div>}
      {result && (
        <div className="timestamp-result">
          <span>
            <strong>nPr (permutations):</strong> {result.nPr.toLocaleString()}
          </span>
          <span>
            <strong>nCr (combinations):</strong> {result.nCr.toLocaleString()}
          </span>
        </div>
      )}
      {!error && numN <= 12 && (
        <p className="tool-placeholder">n! = {factorial(numN).toLocaleString()}</p>
      )}
    </div>
  );
}
