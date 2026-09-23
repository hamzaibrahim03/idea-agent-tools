import { useState } from 'react';
export default function ExponentRootCalculator() {
  const [mode, setMode] = useState('power');
  const [base, setBase] = useState('2');
  const [exponent, setExponent] = useState('10');
  const [radicand, setRadicand] = useState('27');
  const [rootDegree, setRootDegree] = useState('3');
  const baseNum = Number(base);
  const exponentNum = Number(exponent);
  const radicandNum = Number(radicand);
  const rootDegreeNum = Number(rootDegree);
  let result = null;
  let error = '';
  if (mode === 'power') {
    if (Number.isFinite(baseNum) && Number.isFinite(exponentNum)) {
      result = baseNum ** exponentNum;
      if (!Number.isFinite(result)) error = 'Result is too large or undefined.';
    } else {
      error = 'Enter valid numbers.';
    }
  } else {
    if (!Number.isFinite(radicandNum) || !Number.isFinite(rootDegreeNum) || rootDegreeNum === 0) {
      error = 'Enter a valid radicand and a non-zero root degree.';
    } else if (radicandNum < 0 && rootDegreeNum % 2 === 0) {
      error = 'Even root of a negative number is not a real number.';
    } else {
      const sign = radicandNum < 0 ? -1 : 1;
      result = sign * Math.abs(radicandNum) ** (1 / rootDegreeNum);
    }
  }
  return (
    <div className="tool-page">
      <h1>Exponent &amp; Root Calculator</h1>
      <p className="tool-description">
        Calculate a number raised to a power, or the nth root of a number. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="radio" name="exp-mode" checked={mode === 'power'} onChange={() => setMode('power')} />
          Power (base^exponent)
        </label>
        <label className="checkbox-label">
          <input type="radio" name="exp-mode" checked={mode === 'root'} onChange={() => setMode('root')} />
          Root (ⁿ√x)
        </label>
      </div>
      {mode === 'power' ? (
        <div className="tool-controls">
          <input type="number" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '100px' }} />
          <span>^</span>
          <input type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} style={{ width: '100px' }} />
        </div>
      ) : (
        <div className="tool-controls">
          <input type="number" value={rootDegree} onChange={(e) => setRootDegree(e.target.value)} style={{ width: '80px' }} />
          <span>√</span>
          <input type="number" value={radicand} onChange={(e) => setRadicand(e.target.value)} style={{ width: '100px' }} />
        </div>
      )}
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result !== null && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Result:</strong> {result}
          </div>
        </div>
      )}
    </div>
  );
}
