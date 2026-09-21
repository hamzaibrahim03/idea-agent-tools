import { useState } from 'react';
const BASES = [
  { label: 'Binary', value: 2 },
  { label: 'Octal', value: 8 },
  { label: 'Decimal', value: 10 },
  { label: 'Hexadecimal', value: 16 }
];
export default function NumberBaseConverter() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);
  const [error, setError] = useState('');
  let decimalValue = null;
  try {
    if (input.trim()) {
      const cleaned = input.trim().replace(/^0[xXbBoO]/, '');
      const value = parseInt(cleaned, fromBase);
      if (Number.isNaN(value)) throw new Error(`"${input}" is not valid in base ${fromBase}`);
      decimalValue = value;
      if (error) setError('');
    }
  } catch (e) {
    if (!error) setError(e.message);
  }
  return (
    <div className="tool-page">
      <h1>Number Base Converter</h1>
      <p className="tool-description">
        Convert a number between binary, octal, decimal, and hexadecimal. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          From:
          <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label htmlFor="base-input">Value</label>
        <input
          id="base-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {decimalValue !== null && !error && (
        <ul className="uuid-list">
          {BASES.map((b) => (
            <li key={b.value}>
              <span>{b.label}</span>
              <code>{decimalValue.toString(b.value)}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
