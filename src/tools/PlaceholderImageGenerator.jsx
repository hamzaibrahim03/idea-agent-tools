import { useState } from 'react';
function buildUrl(width, height, bgColor, textColor, text) {
  const dimensions = height ? `${width}x${height}` : `${width}`;
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  const colors = bgColor.replace('#', '') + (textColor ? '/' + textColor.replace('#', '') : '');
  const query = params.toString();
  return `https://placehold.co/${dimensions}/${colors}${query ? '?' + query : ''}`;
}
export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState('600');
  const [height, setHeight] = useState('400');
  const [bgColor, setBgColor] = useState('#cccccc');
  const [textColor, setTextColor] = useState('#333333');
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const widthNum = Math.max(1, Math.min(4000, Number(width) || 1));
  const heightNum = height ? Math.max(1, Math.min(4000, Number(height) || 1)) : null;
  const url = buildUrl(widthNum, heightNum, bgColor, textColor, text);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Placeholder Image URL Generator</h1>
      <p className="tool-description">
        Generate a placeholder image URL for mockups and prototypes - set the size, colors, and
        optional label text. The URL is built locally, but the preview below and the image itself
        are rendered by a third-party placeholder image service (placehold.co), not generated in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Width:
          <input type="number" min={1} max={4000} value={width} onChange={(e) => setWidth(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Height (optional, square if blank):
          <input type="number" min={1} max={4000} value={height} onChange={(e) => setHeight(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Background:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </label>
        <label>
          Text color:
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </label>
        <label>
          Label text (optional):
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Hero image" style={{ width: '140px' }} />
        </label>
      </div>
      <div className="tool-panel">
        <label htmlFor="placeholder-url">Generated URL</label>
        <input id="placeholder-url" type="text" value={url} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
      <div className="tool-controls">
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy URL'}</button>
      </div>
      <img src={url} alt="Placeholder preview" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
    </div>
  );
}
