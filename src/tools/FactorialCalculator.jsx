import { useState } from 'react';
const MAX_N = 170;
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
export default function FactorialCalculator() {
  const [n, setN] = useState('5');
  const nNum = parseInt(n, 10);
  const valid = Number.isFinite(nNum) && Number.isInteger(Number(n)) && nNum >= 0 && nNum <= MAX_N;
  const result = valid ? factorial(nNum) : null;
  const steps = valid && nNum > 0 ? Array.from({ length: nNum }, (_, i) => nNum - i).join(' × ') : valid ? '1 (by definition)' : '';
  return (
    <div className="tool-page">
      <h1>Factorial Calculator</h1>
      <p className="tool-description">
        Calculate n! (n factorial) - the product of all positive integers up to n. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <input type="number" min={0} max={MAX_N} step={1} value={n} onChange={(e) => setN(e.target.value)} style={{ width: '100px' }} />
        <span>!</span>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a whole number from 0 to {MAX_N} (factorials beyond {MAX_N}! exceed floating-point precision).
        </div>
      )}
      {result !== null && (
        <div className="timestamp-result">
          <div>
            <strong>
              {n}! =
            </strong>{' '}
            {result.toLocaleString('en-US')}
          </div>
          <div>
            <strong>Expansion:</strong> {steps}
          </div>
        </div>
      )}
    </div>
  );
}
