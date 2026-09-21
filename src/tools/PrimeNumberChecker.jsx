import { useState } from 'react';
const MAX_SIEVE = 1000000;
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
function primesUpTo(limit) {
  const sieve = new Uint8Array(limit + 1);
  const result = [];
  for (let i = 2; i <= limit; i++) {
    if (!sieve[i]) {
      result.push(i);
      for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
    }
  }
  return result;
}
export default function PrimeNumberChecker() {
  const [mode, setMode] = useState('check');
  const [number, setNumber] = useState('17');
  const [limit, setLimit] = useState('100');
  const [copied, setCopied] = useState(false);
  const checkResult = (() => {
    if (number.trim() === '') return null;
    const n = Number(number);
    if (!Number.isInteger(n)) return { error: 'Enter a whole number.' };
    return { prime: isPrime(n), n };
  })();
  const sieveResult = (() => {
    if (limit.trim() === '') return null;
    const n = Number(limit);
    if (!Number.isInteger(n) || n < 2) return { error: 'Enter a whole number of at least 2.' };
    if (n > MAX_SIEVE) return { error: `Limit is capped at ${MAX_SIEVE.toLocaleString()} to avoid freezing the browser.` };
    return { primes: primesUpTo(n) };
  })();
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
          {checkResult?.error && <div className="tool-error">{checkResult.error}</div>}
          {checkResult && !checkResult.error && (
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
          {sieveResult?.error && <div className="tool-error">{sieveResult.error}</div>}
          {sieveResult && !sieveResult.error && (
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
