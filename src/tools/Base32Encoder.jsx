import { useState } from 'react';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function encodeBase32(bytes) {
  let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    output += ALPHABET[parseInt(chunk, 2)];
  }
  while (output.length % 8 !== 0) output += '=';
  return output;
}
function decodeBase32(str) {
  const clean = str.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (const ch of clean) {
    const index = ALPHABET.indexOf(ch);
    if (index === -1) throw new Error(`Invalid Base32 character: "${ch}"`);
    bits += index.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}
function textToBase32(text) {
  return encodeBase32(new TextEncoder().encode(text));
}
function base32ToText(str) {
  const bytes = decodeBase32(str);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
export default function Base32Encoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input) {
    try {
      output = mode === 'encode' ? textToBase32(input) : base32ToText(input);
    } catch (e) {
      error = mode === 'encode' ? 'Unable to encode this input.' : e.message || 'Invalid Base32 input.';
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
      <h1>Base32 Encoder / Decoder</h1>
      <p className="tool-description">
        Encode text to Base32 (RFC 4648) or decode Base32 back to text, with correct padding.
        Runs entirely in your browser.
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
          <label htmlFor="b32-input">{mode === 'encode' ? 'Text' : 'Base32'}</label>
          <textarea
            id="b32-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Text to encode' : 'Base32 string to decode, e.g. NBSWY3DP'}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="b32-output">{mode === 'encode' ? 'Base32' : 'Text'}</label>
          <textarea id="b32-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
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
