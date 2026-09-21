import { useState, useEffect } from 'react';
const ALGORITHMS = ['SHA-256', 'SHA-1', 'SHA-384', 'SHA-512'];
async function computeHmac(message, key, algorithm) {
  const keyBytes = new TextEncoder().encode(key);
  const messageBytes = new TextEncoder().encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
export default function HmacGenerator() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hmac, setHmac] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!message || !key) {
      setHmac('');
      setError('');
      return;
    }
    let cancelled = false;
    computeHmac(message, key, algorithm)
      .then((result) => {
        if (!cancelled) {
          setHmac(result);
          setError('');
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message || 'Unable to compute HMAC.');
          setHmac('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [message, key, algorithm]);
  async function handleCopy() {
    if (!hmac) return;
    try {
      await navigator.clipboard.writeText(hmac);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>HMAC Generator</h1>
      <p className="tool-description">
        Compute an HMAC (Hash-based Message Authentication Code) of a message using a secret key,
        via your browser's built-in Web Crypto API. Runs entirely in your browser - the message
        and key never leave your device.
      </p>
      <div className="tool-controls">
        <label>
          Algorithm:
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                HMAC-{a.replace('-', '')}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy} disabled={!hmac}>
          {copied ? 'Copied!' : 'Copy HMAC'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="hmac-key">Secret key</label>
        <input
          id="hmac-key"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Secret key"
          spellCheck={false}
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="hmac-message">Message</label>
        <textarea
          id="hmac-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to authenticate"
          spellCheck={false}
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="hmac-output">HMAC-{algorithm.replace('-', '')}</label>
        <input
          id="hmac-output"
          type="text"
          value={hmac}
          readOnly
          placeholder="Enter a message and key above"
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
