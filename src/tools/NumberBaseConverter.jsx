import { useEffect, useState } from 'react';
const BASES = [
  { label: 'Binary', value: 2 },
  { label: 'Octal', value: 8 },
  { label: 'Decimal', value: 10 },
  { label: 'Hexadecimal', value: 16 }
];
export default function NumberBaseConverter() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);
  const [decimalValue, setDecimalValue] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    if (!input.trim()) {
      setDecimalValue(null);
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/number-base-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, fromBase } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setDecimalValue(data.decimalValue);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, fromBase]);
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
