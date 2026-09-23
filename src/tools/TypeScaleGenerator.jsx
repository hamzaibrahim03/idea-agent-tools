import { useEffect, useState } from 'react';
const RATIOS = [
  { value: 1.067, label: 'Minor Second (1.067)' },
  { value: 1.125, label: 'Major Second (1.125)' },
  { value: 1.2, label: 'Minor Third (1.2)' },
  { value: 1.25, label: 'Major Third (1.25)' },
  { value: 1.333, label: 'Perfect Fourth (1.333)' },
  { value: 1.5, label: 'Perfect Fifth (1.5)' },
  { value: 1.618, label: 'Golden Ratio (1.618)' }
];
export default function TypeScaleGenerator() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState([]);
  const [cssOutput, setCssOutput] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/type-scale-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { baseSize, ratio } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setScale(data.scale);
            setCssOutput(data.cssOutput);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [baseSize, ratio]);
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
      {error && <div className="agent-error">{error}</div>}
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
