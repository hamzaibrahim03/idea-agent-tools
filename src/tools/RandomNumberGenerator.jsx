import { useState } from 'react';
function randomInt(min, max) {
  const range = max - min + 1;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  let x;
  do {
    x = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return min + (x % range);
}
export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  function handleGenerate() {
    const lo = Math.min(Number(min), Number(max));
    const hi = Math.max(Number(min), Number(max));
    const n = Math.max(1, Math.min(1000, Number(count) || 1));
    if (!allowDuplicates && hi - lo + 1 < n) {
      setError('Range too small for that many unique numbers.');
      return;
    }
    setError('');
    if (allowDuplicates) {
      setResults(Array.from({ length: n }, () => randomInt(lo, hi)));
    } else {
      const pool = [];
      const seen = new Set();
      while (pool.length < n) {
        const v = randomInt(lo, hi);
        if (!seen.has(v)) {
          seen.add(v);
          pool.push(v);
        }
      }
      setResults(pool);
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Number Generator</h1>
      <p className="tool-description">
        Generate random numbers in a range using your browser's cryptographically-random source.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Min:
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Max:
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Count:
          <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} />
          Allow duplicates
        </label>
        <button onClick={handleGenerate}>Generate</button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {results.length > 0 && (
        <div className="regex-highlighted">{results.join(', ')}</div>
      )}
    </div>
  );
}
