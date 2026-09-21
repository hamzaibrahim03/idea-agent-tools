import { useState } from 'react';
function parseNumbers(text) {
  return text
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}
export default function AverageCalculator() {
  const [input, setInput] = useState('4, 8, 15, 16, 23, 42');
  const numbers = parseNumbers(input);
  const valid = numbers.length > 0;
  const sum = valid ? numbers.reduce((a, b) => a + b, 0) : 0;
  const mean = valid ? sum / numbers.length : null;
  const sorted = valid ? [...numbers].sort((a, b) => a - b) : [];
  const mid = Math.floor(sorted.length / 2);
  const median = valid
    ? sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
    : null;
  const min = valid ? sorted[0] : null;
  const max = valid ? sorted[sorted.length - 1] : null;
  return (
    <div className="tool-page">
      <h1>Average (Mean) Calculator</h1>
      <p className="tool-description">
        Calculate the mean, median, sum, minimum, and maximum of a list of numbers. Runs entirely
        in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="avg-input">Numbers (comma or space separated)</label>
        <textarea id="avg-input" value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter at least one valid number.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Count:</strong> {numbers.length}
          </div>
          <div>
            <strong>Sum:</strong> {sum}
          </div>
          <div>
            <strong>Mean (average):</strong> {mean.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
          </div>
          <div>
            <strong>Median:</strong> {median}
          </div>
          <div>
            <strong>Min / Max:</strong> {min} / {max}
          </div>
        </div>
      )}
    </div>
  );
}
