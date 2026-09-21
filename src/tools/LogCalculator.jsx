import { useState } from 'react';
function logBase(value, base) {
  return Math.log(value) / Math.log(base);
}
export default function LogCalculator() {
  const [value, setValue] = useState('100');
  const [base, setBase] = useState('10');
  const valueNum = Number(value);
  const baseNum = Number(base);
  const valid =
    Number.isFinite(valueNum) && valueNum > 0 &&
    Number.isFinite(baseNum) && baseNum > 0 && baseNum !== 1;
  const result = valid ? logBase(valueNum, baseNum) : null;
  const naturalLog = valueNum > 0 ? Math.log(valueNum) : null;
  const log10 = valueNum > 0 ? Math.log10(valueNum) : null;
  const log2 = valueNum > 0 ? Math.log2(valueNum) : null;
  return (
    <div className="tool-page">
      <h1>Logarithm Calculator</h1>
      <p className="tool-description">
        Calculate the logarithm of a number in any base, plus the natural log (ln), log base 10,
        and log base 2 for reference. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          log
          <sub>
            <input type="number" min={0} value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '60px' }} />
          </sub>
          (
          <input type="number" min={0} value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '100px' }} />
          )
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Value must be positive, and base must be positive and not equal to 1.
        </div>
      )}
      {result !== null && (
        <div className="timestamp-result">
          <div>
            <strong>
              log<sub>{base}</sub>({value}):
            </strong>{' '}
            {result.toFixed(6)}
          </div>
          <div>
            <strong>ln({value}):</strong> {naturalLog.toFixed(6)}
          </div>
          <div>
            <strong>log₁₀({value}):</strong> {log10.toFixed(6)}
          </div>
          <div>
            <strong>log₂({value}):</strong> {log2.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}
