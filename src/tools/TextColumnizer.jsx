import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function columnize(items, columnCount) {
  if (items.length === 0) return '';
  const rows = Math.ceil(items.length / columnCount);
  const columns = [];
  for (let c = 0; c < columnCount; c++) {
    columns.push(items.slice(c * rows, c * rows + rows));
  }
  const widths = columns.map((col) => col.reduce((max, item) => Math.max(max, item.length), 0));
  const lines = [];
  for (let r = 0; r < rows; r++) {
    const cells = columns.map((col, c) => (col[r] !== undefined ? col[r].padEnd(widths[c]) : ''));
    lines.push(cells.join('  ').trimEnd());
  }
  return lines.join('\n');
}
export default function TextColumnizer() {
  const [input, setInput] = useState('');
  const [columnCount, setColumnCount] = useState(3);
  const [copied, setCopied] = useState(false);
  const items = useMemo(
    () => input.split('\n').map((l) => l.trim()).filter(Boolean),
    [input]
  );
  const output = useMemo(
    () => columnize(items, Math.max(1, Math.min(items.length || 1, Number(columnCount) || 1))),
    [items, columnCount]
  );
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'columnized.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Text Columnizer</h1>
      <p className="tool-description">
        Paste a list of items, one per line, and arrange them into evenly-sized columns for
        display or printing. Columns are aligned with padding for a clean monospace layout. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Columns:
          <input
            type="number"
            min={1}
            max={12}
            value={columnCount}
            onChange={(e) => setColumnCount(e.target.value)}
            style={{ width: '60px' }}
          />
        </label>
        <span className="tool-placeholder">{items.length} item{items.length === 1 ? '' : 's'}</span>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="col-input">Input (one item per line)</label>
          <textarea id="col-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder={'Apple\nBanana\nCherry\nDate'} />
        </div>
        <div className="tool-panel">
          <label htmlFor="col-output">Columnized output</label>
          <textarea id="col-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
