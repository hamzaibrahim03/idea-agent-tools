import { useState } from 'react';
const DEFAULTS = [
  { key: 'mobile', label: 'Mobile', value: 640 },
  { key: 'tablet', label: 'Tablet', value: 768 },
  { key: 'desktop', label: 'Desktop', value: 1024 },
  { key: 'wide', label: 'Wide', value: 1280 }
];
export default function ResponsiveBreakpointGenerator() {
  const [breakpoints, setBreakpoints] = useState(DEFAULTS);
  const [copied, setCopied] = useState(false);
  function updateValue(key, value) {
    const n = Math.max(0, parseInt(value, 10) || 0);
    setBreakpoints((bps) => bps.map((b) => (b.key === key ? { ...b, value: n } : b)));
  }
  function resetDefaults() {
    setBreakpoints(DEFAULTS);
  }
  const sorted = [...breakpoints].sort((a, b) => a.value - b.value);
  const cssOutput = sorted
    .map((b) => `@media (min-width: ${b.value}px) {\n  /* ${b.label} styles */\n}`)
    .join('\n\n');
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
      <h1>Responsive Breakpoint Generator</h1>
      <p className="tool-description">
        A reference tool showing commonly used CSS breakpoint values (Tailwind-style defaults for
        mobile, tablet, desktop, and wide screens), with copyable media query snippets. Customize
        the pixel values to match your own project. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={resetDefaults}>Reset to defaults</button>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
      </div>
      <div className="tool-panel">
        <label>Breakpoints</label>
        {breakpoints.map((b) => (
          <div key={b.key} className="tool-controls" style={{ marginBottom: 6 }}>
            <span style={{ width: 80 }}>{b.label}</span>
            <input
              type="number"
              min="0"
              value={b.value}
              onChange={(e) => updateValue(b.key, e.target.value)}
              style={{ width: '90px' }}
            />
            <span style={{ opacity: 0.6 }}>px</span>
          </div>
        ))}
      </div>
      <div className="tool-panel">
        <label htmlFor="rbg-output">CSS media queries</label>
        <textarea id="rbg-output" value={cssOutput} readOnly spellCheck={false} style={{ minHeight: 220 }} />
      </div>
    </div>
  );
}
