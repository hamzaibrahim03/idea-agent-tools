import { useState } from 'react';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = /[Il1O0]/;
function generate({ length, lower, upper, digits, symbols, excludeAmbiguous }) {
  let pool = '';
  if (lower) pool += LOWER;
  if (upper) pool += UPPER;
  if (digits) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return '';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => pool[b % pool.length]).join('');
}
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
  const [password, setPassword] = useState(() =>
    generate({ length: 16, lower: true, upper: true, digits: true, symbols: true, excludeAmbiguous: false })
  );
  const [copied, setCopied] = useState(false);
  function handleGenerate() {
    setPassword(generate({ length, lower, upper, digits, symbols, excludeAmbiguous }));
    setCopied(false);
  }
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
