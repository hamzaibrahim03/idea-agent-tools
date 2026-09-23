import { useEffect, useState } from 'react';
export default function SemverComparator() {
  const [versionA, setVersionA] = useState('1.2.3');
  const [versionB, setVersionB] = useState('2.0.0-beta.1');
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/semver-comparator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { versionA, versionB } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setResult(data.result);
            setValidationError(data.validationError);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [versionA, versionB]);
  return (
    <div className="tool-page">
      <h1>Semver Comparator</h1>
      <p className="tool-description">
        Paste two semantic version strings to see which one is greater, per the{' '}
        <a href="https://semver.org/#spec-item-11" target="_blank" rel="noreferrer">semver precedence rules</a>{' '}
        - including prerelease comparisons like 2.0.0-alpha vs 2.0.0-beta. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="semver-a">Version A</label>
          <input
            id="semver-a"
            type="text"
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            placeholder="1.2.3"
            style={{ fontFamily: 'var(--mono)' }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="semver-b">Version B</label>
          <input
            id="semver-b"
            type="text"
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            placeholder="2.0.0-beta.1"
            style={{ fontFamily: 'var(--mono)' }}
          />
        </div>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {validationError && <div className="tool-error">{validationError}</div>}
      {!validationError && result && (
        <div className="timestamp-result">
          <span>
            <strong>Result:</strong>{' '}
            {result.cmp === 0
              ? 'A is equal to B'
              : result.cmp > 0
                ? 'A is greater than B'
                : 'A is less than B'}
          </span>
          <span>
            <strong>Why:</strong> {result.reason}
          </span>
        </div>
      )}
    </div>
  );
}
