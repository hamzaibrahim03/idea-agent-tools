import { useState } from 'react';
function toPx(value, unit, basePx) {
  switch (unit) {
    case 'px': return value;
    case 'rem': return value * basePx;
    case 'em': return value * basePx;
    case 'pt': return value * (96 / 72);
    case '%': return (value / 100) * basePx;
    default: return value;
  }
}
function fromPx(px, unit, basePx) {
  switch (unit) {
    case 'px': return px;
    case 'rem': return px / basePx;
    case 'em': return px / basePx;
    case 'pt': return px * (72 / 96);
    case '%': return (px / basePx) * 100;
    default: return px;
  }
}
const UNITS = ['px', 'rem', 'em', 'pt', '%'];
export default function CssUnitConverter() {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState('px');
  const [basePx, setBasePx] = useState('16');
  const valueNum = Number(value);
  const baseNum = Number(basePx);
  const valid = Number.isFinite(valueNum) && Number.isFinite(baseNum) && baseNum > 0;
  const px = valid ? toPx(valueNum, fromUnit, baseNum) : null;
  return (
    <div className="tool-page">
      <h1>CSS Unit Converter</h1>
      <p className="tool-description">
        Convert between CSS length units - px, rem, em, pt, and %. rem/em/% conversions use a
        configurable base font size (default 16px, the browser default). Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '100px' }} />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <label>
          Base font size (px):
          <input type="number" min={1} value={basePx} onChange={(e) => setBasePx(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a valid number and a positive base font size.
        </div>
      )}
      {valid && (
        <ul className="uuid-list">
          {UNITS.map((u) => (
            <li key={u}>
              <span>{u}</span>
              <code>{Number(fromPx(px, u, baseNum).toFixed(4))}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
