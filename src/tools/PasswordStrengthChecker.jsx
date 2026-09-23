import { useEffect, useState } from 'react';
const CATEGORY_COLOR = {
  'Very weak': '#dc2626',
  Weak: '#ea580c',
  Fair: '#ca8a04',
  Strong: '#16a34a',
  'Very strong': '#0891b2'
};
export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    if (password.length === 0) {
      setResult(null);
      setError('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/password-strength-checker', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { password } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [password]);
  return (
    <div className="tool-page">
      <h1>Password Strength Checker</h1>
      <p className="tool-description">
        Paste a password to get a heuristic strength score, based on length, character variety, and
        common weak patterns (like "1234" or "password"). This is an estimate, not a guarantee -
        and the password is analyzed entirely in memory in your browser and never sent anywhere.
        Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="pw-strength-input">Password</label>
        <input
          id="pw-strength-input"
          type={reveal ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          placeholder="Type or paste a password"
        />
      </div>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} />
          Show password
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && password.length > 0 && result && (
        <>
          <div className="timestamp-result">
            <span>
              <strong>Strength:</strong>{' '}
              <span style={{ color: CATEGORY_COLOR[result.category] || 'inherit' }}>{result.category}</span>
            </span>
            <span>
              <strong>Estimated crack time (heuristic):</strong> {result.crackTime}
            </span>
            <span>
              <strong>Length:</strong> {result.length} characters
            </span>
            <span>
              <strong>Character types used:</strong> {result.varietyCount} of 4 (lower/upper/digit/symbol)
            </span>
          </div>
          {result.flags.length > 0 && (
            <div className="tool-error" style={{ marginTop: 16 }}>
              <strong>Issues found:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                {result.flags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
