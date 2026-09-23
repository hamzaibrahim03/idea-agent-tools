import { useState } from 'react';
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}
function rgbToHex({ r, g, b }) {
  const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function mix(rgb, target, percent) {
  const p = percent / 100;
  return {
    r: rgb.r + (target - rgb.r) * p,
    g: rgb.g + (target - rgb.g) * p,
    b: rgb.b + (target - rgb.b) * p
  };
}
const TINT_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const SHADE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
export default function DesignSystemColorGenerator() {
  const [hex, setHex] = useState('#3366ff');
  const rgb = hexToRgb(hex);
  const valid = !!rgb;
  const tints = valid ? TINT_STEPS.map((p) => ({ percent: p, hex: rgbToHex(mix(rgb, 255, p)) })) : [];
  const shades = valid ? SHADE_STEPS.map((p) => ({ percent: p, hex: rgbToHex(mix(rgb, 0, p)) })) : [];
  return (
    <div className="tool-page">
      <h1>Design System Color Generator</h1>
      <p className="tool-description">
        Enter a base hex color to generate a full set of tints (mixed with white) and shades (mixed
        with black) for a basic design-system color scale, using real RGB interpolation math. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Base color:
          <input type="color" value={valid ? hex : '#3366ff'} onChange={(e) => setHex(e.target.value)} />
        </label>
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: '110px', fontFamily: 'var(--mono)' }} />
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a valid hex color (e.g. #3366ff).
        </div>
      )}
      {valid && (
        <>
          <div className="tool-panel">
            <label>Tints (base + white)</label>
            <div className="timestamp-result">
              {tints.map((t) => (
                <span key={t.percent} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 40, height: 24, borderRadius: 4, border: '1px solid var(--border)', background: t.hex }} />
                  <code>{t.hex}</code>
                  <span style={{ opacity: 0.6 }}>{t.percent}% white</span>
                </span>
              ))}
            </div>
          </div>
          <div className="tool-panel">
            <label>Base color</label>
            <div style={{ width: 60, height: 32, borderRadius: 4, border: '1px solid var(--border)', background: hex }} />
          </div>
          <div className="tool-panel">
            <label>Shades (base + black)</label>
            <div className="timestamp-result">
              {shades.map((s) => (
                <span key={s.percent} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 40, height: 24, borderRadius: 4, border: '1px solid var(--border)', background: s.hex }} />
                  <code>{s.hex}</code>
                  <span style={{ opacity: 0.6 }}>{s.percent}% black</span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
