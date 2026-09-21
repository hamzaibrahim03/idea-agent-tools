import { useState } from 'react';
const RATIOS = [
  { value: 1.067, label: 'Minor Second (1.067)' },
  { value: 1.125, label: 'Major Second (1.125)' },
  { value: 1.2, label: 'Minor Third (1.2)' },
  { value: 1.25, label: 'Major Third (1.25)' },
  { value: 1.333, label: 'Perfect Fourth (1.333)' },
  { value: 1.5, label: 'Perfect Fifth (1.5)' },
  { value: 1.618, label: 'Golden Ratio (1.618)' }
];
const STEPS = [
  { key: 'small', label: 'Small', power: -1 },
  { key: 'body', label: 'Body', power: 0 },
  { key: 'h6', label: 'H6', power: 1 },
  { key: 'h5', label: 'H5', power: 2 },
  { key: 'h4', label: 'H4', power: 3 },
  { key: 'h3', label: 'H3', power: 4 },
  { key: 'h2', label: 'H2', power: 5 },
  { key: 'h1', label: 'H1', power: 6 }
];
export default function TypeScaleGenerator() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [copied, setCopied] = useState(false);
  const base = parseFloat(baseSize) || 16;
  const r = parseFloat(ratio) || 1.25;
  const scale = STEPS.map((s) => ({
    ...s,
    size: Math.round(base * Math.pow(r, s.power) * 100) / 100
  }));
  const cssVars = scale.map((s) => `  --font-${s.key}: ${s.size}px;`).join('\n');
  const cssOutput = `:root {\n${cssVars}\n}`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cssOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Type Scale Generator</h1>
      <p className="tool-description">
        Generate a full font-size scale from a base size and a modular scale ratio, using the
        standard formula size = base &times; ratio^n. Pick a named ratio like Major Third or
        Perfect Fourth, or enter your own. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Base font size (px):
          <input type="number" min="8" step="0.5" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Scale ratio:
          <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
            {RATIOS.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS variables'}</button>
      </div>
      <div className="tool-panel">
        <label>Type scale preview</label>
        <div className="timestamp-result">
          {[...scale].reverse().map((s) => (
            <span key={s.key} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <code style={{ width: 90 }}>{s.label}: {s.size}px</code>
              <span style={{ fontSize: `${Math.min(s.size, 48)}px`, lineHeight: 1.2 }}>Aa</span>
            </span>
          ))}
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="tsg-output">CSS custom properties</label>
        <textarea id="tsg-output" value={cssOutput} readOnly spellCheck={false} style={{ minHeight: 180 }} />
      </div>
    </div>
  );
}
