import { useState } from 'react';
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}
function relativeLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
export default function ContrastRatioChecker() {
  const [foreground, setForeground] = useState('#222222');
  const [background, setBackground] = useState('#ffffff');
  const ratio = contrastRatio(foreground, background);
  const valid = ratio !== null;
  const checks = valid
    ? [
      { label: 'AA - normal text (4.5:1)', pass: ratio >= 4.5 },
      { label: 'AA - large text (3:1)', pass: ratio >= 3 },
      { label: 'AAA - normal text (7:1)', pass: ratio >= 7 },
      { label: 'AAA - large text (4.5:1)', pass: ratio >= 4.5 },
    ]
    : [];
  return (
    <div className="tool-page">
      <h1>Contrast Ratio Checker</h1>
      <p className="tool-description">
        Enter a foreground and background color to compute the WCAG contrast ratio using the real
        relative-luminance formula, and see pass/fail results against the AA and AAA thresholds
        for normal and large text. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Foreground:
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(foreground) ? foreground : '#000000'} onChange={(e) => setForeground(e.target.value)} />
        </label>
        <input type="text" value={foreground} onChange={(e) => setForeground(e.target.value)} style={{ width: '100px', fontFamily: 'var(--mono)' }} />
        <label>
          Background:
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(background) ? background : '#ffffff'} onChange={(e) => setBackground(e.target.value)} />
        </label>
        <input type="text" value={background} onChange={(e) => setBackground(e.target.value)} style={{ width: '100px', fontFamily: 'var(--mono)' }} />
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter valid hex colors for both foreground and background.
        </div>
      )}
      {valid && (
        <>
          <div className="tool-panel">
            <label>Preview</label>
            <div
              style={{
                padding: '24px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background,
                color: foreground,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Sample text on this background
            </div>
          </div>
          <div className="timestamp-result">
            <span>
              <strong>Contrast ratio:</strong> <code>{ratio.toFixed(2)}:1</code>
            </span>
            {checks.map((c) => (
              <span key={c.label}>
                {c.pass ? '✅' : '❌'} {c.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
