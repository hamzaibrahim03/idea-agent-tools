import { useState } from 'react';
export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  function handleGenerate() {
    setLoading(true);
    setError('');
    fetch('/api/tools/random-number-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { min, max, count, allowDuplicates } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results);
        }
      })
      .catch((e) => setError(e.message || 'Failed to compute'))
      .finally(() => setLoading(false));
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
        <button onClick={handleGenerate} disabled={loading}>Generate</button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {results.length > 0 && (
        <div className="regex-highlighted">{results.join(', ')}</div>
      )}
    </div>
  );
}
