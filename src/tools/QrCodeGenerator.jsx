import { useEffect, useState } from 'react';
export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [src, setSrc] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/qr-code-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { text, size } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setSrc(data.src);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [text, size]);
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
      {error && <div className="agent-error">{error}</div>}
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
