import { useState } from 'react';
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';
export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const encoded = encodeURIComponent(text || '');
  const src = text ? `${QR_API}?size=${size}x${size}&data=${encoded}` : '';
  return (
    <div className="tool-page">
      <h1>QR Code Generator</h1>
      <p className="tool-description">
        Generate a QR code for any text or URL. Rendering is done by a third-party QR image
        service (no account/sign-up needed); the tool itself keeps no record of what you enter.
      </p>
      <div className="tool-panel">
        <label htmlFor="qr-input">Text or URL</label>
        <input id="qr-input" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
      </div>
      <div className="tool-controls">
        <label>
          Size:
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={200}>200x200</option>
            <option value={300}>300x300</option>
            <option value={500}>500x500</option>
          </select>
        </label>
        {src && (
          <a href={src} download="qrcode.png" target="_blank" rel="noopener noreferrer">
            Download
          </a>
        )}
      </div>
      {src && (
        <div style={{ marginTop: 16 }}>
          <img src={src} alt="Generated QR code" width={size} height={size} style={{ borderRadius: 8, border: '1px solid var(--border)' }} />
        </div>
      )}
    </div>
  );
}
