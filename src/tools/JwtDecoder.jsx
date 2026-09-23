import { useState } from 'react';
function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}
function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length < 2) {
    throw new Error('Not a valid JWT (expected header.payload.signature)');
  }
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] || '' };
}
export default function JwtDecoder() {
  const [input, setInput] = useState('');
  let decoded = null;
  let error = '';
  if (input.trim()) {
    try {
      decoded = decodeJwt(input);
    } catch (e) {
      error = e.message;
    }
  }
  return (
    <div className="tool-page">
      <h1>JWT Decoder</h1>
      <p className="tool-description">
        Paste a JSON Web Token to inspect its header and payload. Decoding happens entirely in
        your browser - the token is never sent anywhere, and the signature is not verified.
      </p>
      <div className="tool-panel">
        <label htmlFor="jwt-input">Token</label>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOi..."
          spellCheck={false}
          style={{ minHeight: 100 }}
        />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Decode error:</strong> {error}
        </div>
      )}
      {decoded && (
        <div className="tool-grid">
          <div className="tool-panel">
            <label>Header</label>
            <textarea readOnly value={JSON.stringify(decoded.header, null, 2)} spellCheck={false} />
          </div>
          <div className="tool-panel">
            <label>Payload</label>
            <textarea readOnly value={JSON.stringify(decoded.payload, null, 2)} spellCheck={false} />
          </div>
        </div>
      )}
    </div>
  );
}
