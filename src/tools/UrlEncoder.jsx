import { useState } from 'react';
export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const output = input ? encodeURIComponent(input) : '';
  function handleDecode() {
    if (!input) return;
    try {
      setInput(decodeURIComponent(input));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }
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
      <h1>URL Encoder / Decoder</h1>
      <p className="tool-description">
        Percent-encode text for safe use in a URL, or decode a URL-encoded string back to plain
        text. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleDecode} disabled={!input}>
          Decode in place
        </button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy encoded'}
        </button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="url-input">Input</label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text or a URL-encoded string here"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="url-output">Encoded output</label>
          <textarea id="url-output" value={output} readOnly spellCheck={false} placeholder="Encoded text will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Decode error:</strong> {error}
        </div>
      )}
    </div>
  );
}
