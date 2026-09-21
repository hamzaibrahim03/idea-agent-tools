import { useState } from 'react';
function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function decodeBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input) {
    try {
      output = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
    } catch {
      error = mode === 'encode' ? 'Unable to encode this input.' : 'Invalid Base64 input.';
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
  function swap() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
    setInput(output);
  }
  return (
    <div className="tool-page">
      <h1>Base64 Encoder / Decoder</h1>
      <p className="tool-description">
        Encode text to Base64 or decode Base64 back to text, with correct UTF-8 handling (emoji and
        non-English text included). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="radio" name="mode" checked={mode === 'encode'} onChange={() => setMode('encode')} />
          Encode
        </label>
        <label className="checkbox-label">
          <input type="radio" name="mode" checked={mode === 'decode'} onChange={() => setMode('decode')} />
          Decode
        </label>
        <button onClick={swap} disabled={!output}>
          Swap ⇅
        </button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="b64-input">{mode === 'encode' ? 'Text' : 'Base64'}</label>
          <textarea
            id="b64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="b64-output">{mode === 'encode' ? 'Base64' : 'Text'}</label>
          <textarea id="b64-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
