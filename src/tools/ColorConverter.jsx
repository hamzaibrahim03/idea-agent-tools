import { useState } from 'react';
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error('Invalid hex color');
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}
function rgbToHsl({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn: h = ((gn - bn) / d) % 6; break;
      case gn: h = (bn - rn) / d + 2; break;
      default: h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
export default function ColorConverter() {
  const [hex, setHex] = useState('#aa3bff');
  const [error, setError] = useState('');
  let rgb = null;
  let hsl = null;
  try {
    rgb = hexToRgb(hex);
    hsl = rgbToHsl(rgb);
    if (error) setError('');
  } catch (e) {
    if (!error) setError(e.message);
  }
  return (
    <div className="tool-page">
      <h1>Color Converter</h1>
      <p className="tool-description">
        Convert a color between HEX, RGB, and HSL with a live preview swatch. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Color:
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} />
        </label>
        <label>
          Hex:
          <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '110px', fontFamily: 'var(--mono)' }} />
        </label>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {rgb && hsl && (
        <div className="timestamp-result">
          <div
            style={{
              height: 60,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: hex,
              marginBottom: 8
            }}
          />
          <span>
            <strong>HEX:</strong> <code>{hex}</code>
          </span>
          <span>
            <strong>RGB:</strong> <code>rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
          </span>
          <span>
            <strong>HSL:</strong> <code>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
          </span>
        </div>
      )}
    </div>
  );
}
