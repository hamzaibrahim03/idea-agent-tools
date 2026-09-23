import { useState } from 'react';
const LINEAR_MULTIPLES = [0.5, 1, 2, 3, 4, 6, 8, 12, 16];
const GEOMETRIC_STEPS = 8;
function buildLinearScale(base) {
  return LINEAR_MULTIPLES.map((m) => Math.round(base * m * 100) / 100);
}
function buildGeometricScale(base, ratio) {
  const values = [];
  for (let i = 0; i < GEOMETRIC_STEPS; i++) {
    values.push(Math.round(base * Math.pow(ratio, i) * 100) / 100);
  }
  return values;
}
export default function DesignSpacingScaleGenerator() {
  const [base, setBase] = useState(8);
  const [scaleType, setScaleType] = useState('linear');
  const [ratio, setRatio] = useState(1.5);
  const [copied, setCopied] = useState(false);
  const baseNum = parseFloat(base) || 0;
  const ratioNum = parseFloat(ratio) || 1;
  const scale = scaleType === 'linear' ? buildLinearScale(baseNum) : buildGeometricScale(baseNum, ratioNum);
  const uniqueScale = [...new Set(scale)];
  const cssVars = uniqueScale.map((v, i) => `  --space-${i + 1}: ${v}px;`).join('\n');
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
      <h1>Design Spacing Scale Generator</h1>
      <p className="tool-description">
        Generate a consistent spacing scale for a design system from a base unit - either a linear
        scale (simple multiples of your base) or a geometric scale (each step multiplied by a
        ratio). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Base unit (px):
          <input type="number" min="1" step="0.5" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Scale type:
          <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
            <option value="linear">Linear (common multiples)</option>
            <option value="geometric">Geometric (ratio-based)</option>
          </select>
        </label>
        {scaleType === 'geometric' && (
          <label>
            Ratio:
            <input type="number" min="1.01" step="0.05" value={ratio} onChange={(e) => setRatio(e.target.value)} style={{ width: '70px' }} />
          </label>
        )}
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS variables'}</button>
      </div>
      <div className="tool-panel">
        <label>Spacing scale</label>
        <div className="timestamp-result">
          {uniqueScale.map((v, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ width: 80 }}>{v}px</code>
              <span style={{ height: 14, width: v, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 2 }} />
            </span>
          ))}
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="dssg-output">CSS custom properties</label>
        <textarea id="dssg-output" value={cssOutput} readOnly spellCheck={false} style={{ minHeight: 160 }} />
      </div>
    </div>
  );
}
