import { useEffect, useState } from 'react';
function strengthLabel(pw) {
  if (!pw) return '';
  const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((re) => re.test(pw)).length;
  const score = pw.length * variety;
  if (score >= 80) return 'Strong';
  if (score >= 40) return 'Medium';
  return 'Weak';
}
export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  async function handleGenerate() {
    setError('');
    try {
      const r = await fetch('/api/tools/password-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { length, lower, upper, digits, symbols, excludeAmbiguous } })
      });
      const data = await r.json();
      if (data.error) setError(data.error);
      else setPassword(data.password);
      setCopied(false);
    } catch (e) {
      setError(e.message || 'Failed to generate');
    }
  }
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function handleCopy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  const noOptionsSelected = !lower && !upper && !digits && !symbols;
  return (
    <div className="tool-page">
      <h1>Password Generator</h1>
      <p className="tool-description">
        Generate a random password using your browser's cryptographically-random source. Nothing
        is sent to a server or stored anywhere.
      </p>
      <div className="tool-controls">
        <label>
          Length:
          <input
            type="number"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '70px' }}
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
          Lowercase
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          Uppercase
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} />
          Digits
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
          Symbols
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} />
          Exclude ambiguous (Il1O0)
        </label>
      </div>
      <div className="tool-controls">
        <button onClick={handleGenerate} disabled={noOptionsSelected}>
          Generate
        </button>
        <button onClick={handleCopy} disabled={!password}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {noOptionsSelected && <div className="tool-error">Select at least one character type.</div>}
      {error && <div className="agent-error">{error}</div>}
      {password && (
        <div className="timestamp-result">
          <code style={{ fontSize: 16, wordBreak: 'break-all' }}>{password}</code>
          <span>
            <strong>Strength:</strong> {strengthLabel(password)}
          </span>
        </div>
      )}
    </div>
  );
}
