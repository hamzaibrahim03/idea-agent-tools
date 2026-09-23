import { useState } from 'react';
const COMMON_PATTERNS = [
  '1234', '12345', '123456', 'password', 'qwerty', 'letmein', 'welcome',
  'admin', 'abc123', '111111', '000000', 'iloveyou', 'dragon', 'monkey'
];
const KEYBOARD_RUNS = ['qwerty', 'asdfgh', 'zxcvbn', '123456', '098765'];
function analyzePassword(pw) {
  const length = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  const lower = pw.toLowerCase();
  const flags = [];
  if (COMMON_PATTERNS.some((p) => lower.includes(p))) {
    flags.push('Contains a very common password or sequence');
  }
  if (KEYBOARD_RUNS.some((p) => lower.includes(p))) {
    flags.push('Contains a keyboard-adjacent run (e.g. "qwerty")');
  }
  if (/^\d+$/.test(pw)) {
    flags.push('Digits only');
  }
  if (/^[a-zA-Z]+$/.test(pw)) {
    flags.push('Letters only');
  }
  if (/(.)\1{2,}/.test(pw)) {
    flags.push('Contains a repeated character run (e.g. "aaa")');
  }
  if (/^(.+)\1+$/.test(pw) && pw.length >= 4) {
    flags.push('Entire password is a repeated pattern');
  }
  if (length > 0 && length < 8) {
    flags.push('Shorter than the commonly recommended minimum of 8 characters');
  }
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;
  const entropyBits = length > 0 && poolSize > 0 ? length * Math.log2(poolSize) : 0;
  const penalty = flags.length * 12;
  const effectiveScore = Math.max(0, entropyBits - penalty);
  let category;
  let crackTime;
  if (length === 0) {
    category = 'none';
    crackTime = '—';
  } else if (effectiveScore < 28 || flags.length >= 2) {
    category = 'Very weak';
    crackTime = 'Instantly to a few minutes';
  } else if (effectiveScore < 40) {
    category = 'Weak';
    crackTime = 'Minutes to a few hours';
  } else if (effectiveScore < 60) {
    category = 'Fair';
    crackTime = 'Days to months';
  } else if (effectiveScore < 80) {
    category = 'Strong';
    crackTime = 'Years to centuries';
  } else {
    category = 'Very strong';
    crackTime = 'Centuries or more';
  }
  return { length, hasLower, hasUpper, hasDigit, hasSymbol, varietyCount, flags, entropyBits, category, crackTime };
}
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
  const result = analyzePassword(password);
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
      {password.length > 0 && (
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
