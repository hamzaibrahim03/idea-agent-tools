import { useEffect, useState } from 'react';
const MAX_SIEVE = 1000000;
export default function PrimeNumberChecker() {
  const [mode, setMode] = useState('check');
  const [number, setNumber] = useState('17');
  const [limit, setLimit] = useState('100');
  const [copied, setCopied] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [sieveResult, setSieveResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/prime-number-checker', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { number, limit } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setCheckResult(data.checkResult);
            setSieveResult(data.sieveResult);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [number, limit]);
  async function handleCopy() {
    if (!sieveResult || sieveResult.error) return;
    try {
      await navigator.clipboard.writeText(sieveResult.primes.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Prime Number Checker</h1>
      <p className="tool-description">
        Check whether a number is prime, or list every prime number up to a limit using the Sieve
        of Eratosthenes. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="check">Check a number</option>
            <option value="list">List primes up to N</option>
          </select>
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {mode === 'check' ? (
        <>
          <div className="tool-panel">
            <label htmlFor="prime-input">Number</label>
            <input
              id="prime-input"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              style={{ width: '160px' }}
            />
          </div>
          {!error && checkResult?.error && <div className="tool-error">{checkResult.error}</div>}
          {!error && checkResult && !checkResult.error && (
            <div className="timestamp-result">
              <strong>
                {checkResult.n} is {checkResult.prime ? 'a prime number.' : 'not a prime number.'}
              </strong>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="tool-controls">
            <label>
              Up to:
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                min={2}
                max={MAX_SIEVE}
                style={{ width: '120px' }}
              />
            </label>
            <button onClick={handleCopy} disabled={!sieveResult || sieveResult.error}>
              {copied ? 'Copied!' : 'Copy list'}
            </button>
          </div>
          {!error && sieveResult?.error && <div className="tool-error">{sieveResult.error}</div>}
          {!error && sieveResult && !sieveResult.error && (
            <div className="tool-panel">
              <label>{sieveResult.primes.length.toLocaleString()} primes found</label>
              <textarea readOnly value={sieveResult.primes.join(', ')} style={{ minHeight: '160px' }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
