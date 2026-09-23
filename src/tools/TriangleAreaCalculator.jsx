import { useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
export default function TriangleAreaCalculator() {
  const [mode, setMode] = useState('base-height');
  const [base, setBase] = useState('10');
  const [height, setHeight] = useState('5');
  const [sideA, setSideA] = useState('3');
  const [sideB, setSideB] = useState('4');
  const [sideC, setSideC] = useState('5');
  let result = null;
  let error = '';
  if (mode === 'base-height') {
    const b = Number(base);
    const h = Number(height);
    if (base === '' || height === '' || Number.isNaN(b) || Number.isNaN(h) || b <= 0 || h <= 0) {
      error = 'Enter positive numbers for base and height.';
    } else {
      result = 0.5 * b * h;
    }
  } else {
    const x = Number(sideA);
    const y = Number(sideB);
    const z = Number(sideC);
    if (
      sideA === '' || sideB === '' || sideC === '' ||
      [x, y, z].some((n) => Number.isNaN(n) || n <= 0)
    ) {
      error = 'Enter positive numbers for all three sides.';
    } else if (x + y <= z || x + z <= y || y + z <= x) {
      error = 'These side lengths do not form a valid triangle (triangle inequality violated).';
    } else {
      const s = (x + y + z) / 2;
      result = Math.sqrt(s * (s - x) * (s - y) * (s - z));
    }
  }
  return (
    <div className="tool-page">
      <h1>Triangle Area Calculator</h1>
      <p className="tool-description">
        Calculate a triangle's area from its base and height, or from three side lengths using
        Heron's formula. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Method:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="base-height">Base &amp; height</option>
            <option value="sides">Three sides (Heron's formula)</option>
          </select>
        </label>
      </div>
      {mode === 'base-height' ? (
        <div className="tool-controls">
          <label>
            Base:
            <input type="number" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Height:
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      ) : (
        <div className="tool-controls">
          <label>
            Side a:
            <input type="number" value={sideA} onChange={(e) => setSideA(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Side b:
            <input type="number" value={sideB} onChange={(e) => setSideB(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Side c:
            <input type="number" value={sideC} onChange={(e) => setSideC(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      )}
      {error && <div className="tool-error">{error}</div>}
      {result !== null && !error && (
        <div className="timestamp-result">
          <strong>Area = {formatNum(result)}</strong>
        </div>
      )}
    </div>
  );
}
