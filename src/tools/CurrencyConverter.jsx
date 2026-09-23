import { useState } from 'react';
const EXAMPLE_RATES = [
  { label: 'USD -> EUR (example: 0.92)', value: '0.92' },
  { label: 'USD -> GBP (example: 0.78)', value: '0.78' },
  { label: 'EUR -> USD (example: 1.09)', value: '1.09' },
  { label: 'USD -> JPY (example: 149.5)', value: '149.5' }
];
export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [rate, setRate] = useState('0.92');
  const [fromLabel, setFromLabel] = useState('Amount');
  const [toLabel, setToLabel] = useState('Converted');
  const amountNum = Number(amount);
  const rateNum = Number(rate);
  const valid = Number.isFinite(amountNum) && amountNum >= 0 && Number.isFinite(rateNum) && rateNum > 0;
  const converted = valid ? amountNum * rateNum : 0;
  return (
    <div className="tool-page">
      <h1>Currency Converter (Custom Rate)</h1>
      <p className="tool-description">
        Convert an amount using an exchange rate you supply yourself, or pick one of the example
        rates below. This tool does not fetch live exchange rates from any API - all rates are
        user-entered or illustrative examples, not real-time market data. Always check a live
        source before making financial decisions. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cc-from-label">From currency label</label>
          <input id="cc-from-label" type="text" value={fromLabel} onChange={(e) => setFromLabel(e.target.value)} placeholder="e.g. USD" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cc-to-label">To currency label</label>
          <input id="cc-to-label" type="text" value={toLabel} onChange={(e) => setToLabel(e.target.value)} placeholder="e.g. EUR" />
        </div>
      </div>
      <div className="tool-controls">
        <label>
          Amount ({fromLabel || 'from'}):
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Exchange rate:
          <input type="number" min={0} step="0.0001" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Example rate:
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) setRate(e.target.value);
            }}
          >
            <option value="">Pick an example rate...</option>
            {EXAMPLE_RATES.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative amount and a positive exchange rate.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>
              {amountNum} {fromLabel || 'units'} =
            </strong>{' '}
            <code>{converted.toFixed(4)}</code> {toLabel || 'units'}
          </div>
          <div>
            <strong>Rate used:</strong> <code>{rateNum}</code> (user-supplied, not live market data)
          </div>
        </div>
      )}
    </div>
  );
}
