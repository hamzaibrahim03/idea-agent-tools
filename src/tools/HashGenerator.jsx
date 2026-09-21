import { useState, useEffect } from 'react';
const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];
async function hashText(text, algorithm) {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!input) {
      setHash('');
      return;
    }
    let cancelled = false;
    hashText(input, algorithm).then((result) => {
      if (!cancelled) setHash(result);
    });
    return () => {
      cancelled = true;
    };
  }, [input, algorithm]);
  async function handleCopy() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Hash Generator</h1>
      <p className="tool-description">
        Compute a hash of any text using your browser's built-in Web Crypto API. Nothing leaves
        your browser. Note: MD5 isn't exposed by Web Crypto, so SHA-1/256/384/512 are offered
        instead.
      </p>
      <div className="tool-controls">
        <label>
          Algorithm:
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy} disabled={!hash}>
          {copied ? 'Copied!' : 'Copy hash'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="hash-input">Input</label>
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash"
          spellCheck={false}
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="hash-output">{algorithm} hash</label>
        <input id="hash-output" type="text" value={hash} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}
