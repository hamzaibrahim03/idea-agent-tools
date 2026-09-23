import { useEffect, useState } from 'react';
export default function LogCalculator() {
  const [value, setValue] = useState('100');
  const [base, setBase] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/log-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { value, base } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [value, base]);
  return (
    <div className="tool-page">
      <h1>Logarithm Calculator</h1>
      <p className="tool-description">
        Calculate the logarithm of a number in any base, plus the natural log (ln), log base 10,
        and log base 2 for reference.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          log
          <sub>
            <input type="number" min={0} value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '60px' }} />
          </sub>
          (
          <input type="number" min={0} value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '100px' }} />
          )
        </label>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>
              log<sub>{base}</sub>({value}):
            </strong>{' '}
            {result.result.toFixed(6)}
          </div>
          <div>
            <strong>ln({value}):</strong> {result.naturalLog.toFixed(6)}
          </div>
          <div>
            <strong>log₁₀({value}):</strong> {result.log10.toFixed(6)}
          </div>
          <div>
            <strong>log₂({value}):</strong> {result.log2.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}
