import { useState } from 'react';
function toScientific(n, precision) {
  if (n === 0) return { mantissa: 0, exponent: 0 };
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const exponent = Math.floor(Math.log10(abs));
  let mantissa = abs / 10 ** exponent;
  let e = exponent;
  if (mantissa >= 10) {
    mantissa /= 10;
    e += 1;
  } else if (mantissa < 1) {
    mantissa *= 10;
    e -= 1;
  }
  const rounded = Number(mantissa.toFixed(precision));
  if (rounded >= 10) {
    return { mantissa: sign * (rounded / 10), exponent: e + 1 };
  }
  return { mantissa: sign * rounded, exponent: e };
}
const SUPERSCRIPT_MAP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
function toSuperscript(n) {
  return String(n)
    .split('')
    .map((ch) => SUPERSCRIPT_MAP[ch] ?? ch)
    .join('');
}
export default function ScientificNotationConverter() {
  const [mode, setMode] = useState('to-scientific');
  const [decimalInput, setDecimalInput] = useState('0.000123');
  const [mantissaInput, setMantissaInput] = useState('1.23');
  const [exponentInput, setExponentInput] = useState('-4');
  const [precision, setPrecision] = useState('6');
  let error = '';
  let scientificResult = '';
  let decimalResult = '';
  const precisionNum = Math.max(0, Math.min(15, Number(precision) || 0));
  if (mode === 'to-scientific') {
    const n = Number(decimalInput);
    if (decimalInput.trim() === '' || Number.isNaN(n)) {
      error = 'Enter a valid decimal number.';
    } else {
      const { mantissa, exponent } = toScientific(n, precisionNum);
      scientificResult = `${mantissa} × 10${toSuperscript(exponent)}`;
    }
  } else {
    const m = Number(mantissaInput);
    const e = Number(exponentInput);
    if (mantissaInput.trim() === '' || exponentInput.trim() === '' || Number.isNaN(m) || Number.isNaN(e)) {
      error = 'Enter a valid mantissa and integer exponent.';
    } else if (!Number.isInteger(e)) {
      error = 'The exponent must be a whole number.';
    } else {
      const value = m * 10 ** e;
      decimalResult = value.toLocaleString('en-US', { maximumFractionDigits: 20, useGrouping: false });
    }
  }
  return (
    <div className="tool-page">
      <h1>Scientific Notation Converter</h1>
      <p className="tool-description">
        Convert between standard decimal notation and scientific notation (e.g. 0.000123 ⇄ 1.23 ×
        10⁻⁴), for both very large and very small numbers. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Direction:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="to-scientific">Decimal → Scientific</option>
            <option value="to-decimal">Scientific → Decimal</option>
          </select>
        </label>
        <label>
          Precision (decimal places):
          <input
            type="number"
            min={0}
            max={15}
            value={precision}
            onChange={(e) => setPrecision(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
      </div>
      {mode === 'to-scientific' ? (
        <div className="tool-panel">
          <label htmlFor="decimal-input">Decimal number</label>
          <input
            id="decimal-input"
            type="text"
            value={decimalInput}
            onChange={(e) => setDecimalInput(e.target.value)}
            placeholder="e.g. 0.000123"
          />
        </div>
      ) : (
        <div className="tool-controls">
          <label>
            Mantissa:
            <input
              type="number"
              value={mantissaInput}
              onChange={(e) => setMantissaInput(e.target.value)}
              style={{ width: '110px' }}
            />
          </label>
          <span>× 10^</span>
          <label>
            Exponent:
            <input
              type="number"
              value={exponentInput}
              onChange={(e) => setExponentInput(e.target.value)}
              style={{ width: '90px' }}
            />
          </label>
        </div>
      )}
      {error && <div className="tool-error">{error}</div>}
      {!error && mode === 'to-scientific' && (
        <div className="timestamp-result">
          <strong>{scientificResult}</strong>
        </div>
      )}
      {!error && mode === 'to-decimal' && (
        <div className="timestamp-result">
          <strong style={{ fontFamily: 'var(--mono)' }}>{decimalResult}</strong>
        </div>
      )}
    </div>
  );
}
