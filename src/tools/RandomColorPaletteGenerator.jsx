import { useState } from 'react';
function randomInRange(min, max) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const fraction = buf[0] / 0x100000000;
  return min + fraction * (max - min);
}
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n) => Math.round(f(n) * 255).toString(16).padStart(2, '0');
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}
function randomSwatch() {
  const h = Math.floor(randomInRange(0, 360));
  const s = Math.round(randomInRange(55, 85));
  const l = Math.round(randomInRange(45, 70));
  return { hex: hslToHex(h, s, l), h, s, l };
}
function generatePalette() {
  return Array.from({ length: 5 }, randomSwatch);
}
export default function RandomColorPaletteGenerator() {
  const [palette, setPalette] = useState(generatePalette);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  function handleRegenerate() {
    setPalette(generatePalette());
    setCopiedIndex(-1);
  }
  async function handleCopy(hex, index) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Color Palette Generator</h1>
      <p className="tool-description">
        Generate a random 5-color palette using your browser's cryptographically-random source, with
        hue spread across the wheel and saturation/lightness kept in pleasant ranges. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleRegenerate}>Regenerate palette</button>
      </div>
      <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {palette.map((swatch, i) => (
          <div key={i} className="tool-panel" style={{ marginBottom: 0 }}>
            <div
              style={{
                height: 100,
                borderRadius: 8,
                background: swatch.hex,
                border: '1px solid var(--border)'
              }}
            />
            <button onClick={() => handleCopy(swatch.hex, i)} style={{ width: '100%' }}>
              {copiedIndex === i ? 'Copied!' : swatch.hex.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
