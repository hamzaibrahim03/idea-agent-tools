import { useState } from 'react';
function buildCss({ columns, rows, gap }) {
  return [
    '.container {',
    `  display: grid;`,
    `  grid-template-columns: repeat(${columns}, 1fr);`,
    `  grid-template-rows: repeat(${rows}, 1fr);`,
    `  gap: ${gap}px;`,
    '}',
  ].join('\n');
}
export default function CssGridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [copied, setCopied] = useState(false);
  const css = buildCss({ columns, rows, gap });
  const cellCount = columns * rows;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>CSS Grid Generator</h1>
      <p className="tool-description">
        Set the number of columns, rows, and gap to build a CSS Grid layout, with a live preview
        of sample cells and the generated container CSS. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Columns: {columns}
          <input type="range" min={1} max={8} value={columns} onChange={(e) => setColumns(Number(e.target.value))} />
        </label>
        <label>
          Rows: {rows}
          <input type="range" min={1} max={8} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
        </label>
        <label>
          Gap: {gap}px
          <input type="range" min={0} max={48} value={gap} onChange={(e) => setGap(Number(e.target.value))} />
        </label>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy CSS'}</button>
      </div>
      <div className="tool-panel">
        <label>Preview</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}px`,
            padding: 16,
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--code-bg)',
          }}
        >
          {Array.from({ length: cellCount }, (_, i) => (
            <div
              key={i}
              style={{
                minHeight: 48,
                borderRadius: 6,
                background: 'var(--accent-border)',
                color: 'var(--text-h)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="grid-output">Generated CSS</label>
        <textarea id="grid-output" value={css} readOnly spellCheck={false} />
      </div>
    </div>
  );
}
