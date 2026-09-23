import { useEffect, useState } from 'react';
export default function ScientificNotationConverter() {
  const [mode, setMode] = useState('to-scientific');
  const [decimalInput, setDecimalInput] = useState('0.000123');
  const [mantissaInput, setMantissaInput] = useState('1.23');
  const [exponentInput, setExponentInput] = useState('-4');
  const [precision, setPrecision] = useState('6');
  const [data, setData] = useState({ validationError: '', scientificResult: '', decimalResult: '' });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/scientific-notation-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { mode, decimalInput, mantissaInput, exponentInput, precision } })
      })
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          if (d.error) setError(d.error);
          else setData(d);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [mode, decimalInput, mantissaInput, exponentInput, precision]);
  const { validationError, scientificResult, decimalResult } = data;
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
      {error && <div className="agent-error">{error}</div>}
      {validationError && <div className="tool-error">{validationError}</div>}
      {!validationError && mode === 'to-scientific' && (
        <div className="timestamp-result">
          <strong>{scientificResult}</strong>
        </div>
      )}
      {!validationError && mode === 'to-decimal' && (
        <div className="timestamp-result">
          <strong style={{ fontFamily: 'var(--mono)' }}>{decimalResult}</strong>
        </div>
      )}
    </div>
  );
}
