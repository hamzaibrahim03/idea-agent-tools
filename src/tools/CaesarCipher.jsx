import { useState } from 'react';
function shiftChar(char, shift) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
  }
  return char;
}
function caesarShift(text, shift) {
  return [...text].map((ch) => shiftChar(ch, shift)).join('');
}
export default function CaesarCipher() {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [bruteForce, setBruteForce] = useState(false);
  const [copied, setCopied] = useState(false);
  const effectiveShift = mode === 'encrypt' ? shift : -shift;
  const output = input ? caesarShift(input, effectiveShift) : '';
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Caesar Cipher</h1>
      <p className="tool-description">
        Encrypt or decrypt text with a Caesar cipher shift, wrapping around the alphabet and
        preserving case and punctuation. Use brute force mode to try all 26 shifts when you don't
        know the key. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={bruteForce}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </label>
        <label>
          Shift:
          <input
            type="range"
            min={-25}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            disabled={bruteForce}
          />
        </label>
        <input
          type="number"
          min={-25}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          disabled={bruteForce}
          style={{ width: '60px' }}
        />
        <label className="checkbox-label">
          <input type="checkbox" checked={bruteForce} onChange={(e) => setBruteForce(e.target.checked)} />
          Brute force (try all shifts)
        </label>
        {!bruteForce && (
          <button onClick={handleCopy} disabled={!output}>
            {copied ? 'Copied!' : 'Copy output'}
          </button>
        )}
      </div>
      <div className="tool-panel">
        <label htmlFor="caesar-input">Text</label>
        <textarea
          id="caesar-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. abc"
          spellCheck={false}
        />
      </div>
      {!bruteForce && (
        <div className="tool-panel">
          <label htmlFor="caesar-output">Result</label>
          <textarea id="caesar-output" value={output} readOnly spellCheck={false} />
        </div>
      )}
      {bruteForce && input && (
        <ul className="uuid-list">
          {Array.from({ length: 26 }, (_, i) => i + 1).map((s) => (
            <li key={s}>
              <span>Shift {s}</span>
              <code>{caesarShift(input, -s)}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
