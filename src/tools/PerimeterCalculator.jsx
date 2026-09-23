import { useState } from 'react';
export default function PerimeterCalculator() {
  const [shape, setShape] = useState('rectangle');
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('6');
  const [sideA, setSideA] = useState('5');
  const [sideB, setSideB] = useState('6');
  const [sideC, setSideC] = useState('7');
  const [radius, setRadius] = useState('4');
  const [polySide, setPolySide] = useState('5');
  const [polyCount, setPolyCount] = useState('6');
  let perimeter = null;
  let error = '';
  let note = '';
  if (shape === 'rectangle') {
    const l = Number(length);
    const w = Number(width);
    if (!(l > 0 && w > 0)) error = 'Enter positive length and width.';
    else perimeter = 2 * (l + w);
  } else if (shape === 'triangle') {
    const a = Number(sideA);
    const b = Number(sideB);
    const c = Number(sideC);
    if (!(a > 0 && b > 0 && c > 0)) error = 'Enter three positive side lengths.';
    else if (a + b <= c || a + c <= b || b + c <= a) error = 'These three sides cannot form a valid triangle.';
    else perimeter = a + b + c;
  } else if (shape === 'circle') {
    const r = Number(radius);
    if (!(r > 0)) error = 'Enter a positive radius.';
    else {
      perimeter = 2 * Math.PI * r;
      note = 'Circumference';
    }
  } else {
    const s = Number(polySide);
    const n = Number(polyCount);
    if (!(s > 0) || !(Number.isInteger(n) && n >= 3)) error = 'Enter a positive side length and an integer number of sides (3 or more).';
    else perimeter = s * n;
  }
  return (
    <div className="tool-page">
      <h1>Perimeter Calculator</h1>
      <p className="tool-description">
        Compute the perimeter of a rectangle, triangle, circle (circumference), or regular polygon
        from its dimensions using the standard formula for each shape. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Shape:
          <select value={shape} onChange={(e) => setShape(e.target.value)}>
            <option value="rectangle">Rectangle</option>
            <option value="triangle">Triangle</option>
            <option value="circle">Circle</option>
            <option value="polygon">Regular polygon</option>
          </select>
        </label>
      </div>
      {shape === 'rectangle' && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="pc-length">Length</label>
            <input id="pc-length" type="number" min={0} value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="pc-width">Width</label>
            <input id="pc-width" type="number" min={0} value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
        </div>
      )}
      {shape === 'triangle' && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="pc-a">Side A</label>
            <input id="pc-a" type="number" min={0} value={sideA} onChange={(e) => setSideA(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="pc-b">Side B</label>
            <input id="pc-b" type="number" min={0} value={sideB} onChange={(e) => setSideB(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="pc-c">Side C</label>
            <input id="pc-c" type="number" min={0} value={sideC} onChange={(e) => setSideC(e.target.value)} />
          </div>
        </div>
      )}
      {shape === 'circle' && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="pc-radius">Radius</label>
            <input id="pc-radius" type="number" min={0} value={radius} onChange={(e) => setRadius(e.target.value)} />
          </div>
        </div>
      )}
      {shape === 'polygon' && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="pc-poly-side">Side length</label>
            <input id="pc-poly-side" type="number" min={0} value={polySide} onChange={(e) => setPolySide(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="pc-poly-count">Number of sides</label>
            <input id="pc-poly-count" type="number" min={3} step={1} value={polyCount} onChange={(e) => setPolyCount(e.target.value)} />
          </div>
        </div>
      )}
      {error && <div className="tool-error">{error}</div>}
      {perimeter !== null && !error && (
        <div className="timestamp-result">
          <strong>{note || 'Perimeter'}:</strong> {perimeter.toFixed(3)}
        </div>
      )}
    </div>
  );
}
