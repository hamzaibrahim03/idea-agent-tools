import { useState } from 'react';
function gcdTwo(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcdTwo(a, b);
}
function gcdList(nums) {
  return nums.reduce((acc, n) => gcdTwo(acc, n));
}
function lcmList(nums) {
  return nums.reduce((acc, n) => lcmTwo(acc, n));
}
export default function GcdLcmCalculator() {
  const [input, setInput] = useState('12, 18');
  const parsed = input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number);
  let error = '';
  if (parsed.length < 2) {
    error = 'Enter at least two numbers, separated by commas or spaces.';
  } else if (parsed.some((n) => !Number.isInteger(n))) {
    error = 'All values must be whole numbers.';
  } else if (parsed.every((n) => n === 0)) {
    error = 'At least one number must be non-zero.';
  }
  const result = !error ? { gcd: gcdList(parsed), lcm: lcmList(parsed) } : null;
  return (
    <div className="tool-page">
      <h1>GCD / LCM Calculator</h1>
      <p className="tool-description">
        Compute the greatest common divisor (via the Euclidean algorithm) and least common
        multiple of two or more whole numbers. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="gcd-input">Numbers (comma or space separated)</label>
        <input
          id="gcd-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12, 18, 24"
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {result && (
        <div className="timestamp-result">
          <span>
            <strong>GCD:</strong> {result.gcd}
          </span>
          <span>
            <strong>LCM:</strong> {result.lcm.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
