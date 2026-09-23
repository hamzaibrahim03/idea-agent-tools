import { useState } from 'react';
const ALIGNMENTS = ['left', 'center', 'right'];
function makeGrid(rows, cols, fill = '') {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => fill || `Cell ${r + 1}-${c + 1}`)
  );
}
function alignmentMarker(align) {
  if (align === 'center') return ':---:';
  if (align === 'right') return '---:';
  return ':---';
}
function buildMarkdown(headers, rows, alignments) {
  const colCount = headers.length;
  const widths = Array.from({ length: colCount }, (_, c) => {
    const headerLen = (headers[c] || '').length;
    const cellLens = rows.map((r) => (r[c] || '').length);
    return Math.max(3, headerLen, ...cellLens);
  });
  const pad = (text, w) => (text || '').padEnd(w, ' ');
  const headerLine = `| ${headers.map((h, c) => pad(h, widths[c])).join(' | ')} |`;
  const dividerLine = `| ${alignments.map((a, c) => alignmentMarker(a).padEnd(widths[c], '-')).join(' | ')} |`;
  const bodyLines = rows.map((row) => `| ${row.map((cell, c) => pad(cell, widths[c])).join(' | ')} |`);
  return [headerLine, dividerLine, ...bodyLines].join('\n');
}
export default function MarkdownTableGenerator() {
  const [headers, setHeaders] = useState(['Header 1', 'Header 2', 'Header 3']);
  const [alignments, setAlignments] = useState(['left', 'left', 'left']);
  const [rows, setRows] = useState(makeGrid(2, 3));
  const [copied, setCopied] = useState(false);
  function updateHeader(index, value) {
    setHeaders((h) => h.map((v, i) => (i === index ? value : v)));
  }
  function updateAlignment(index, value) {
    setAlignments((a) => a.map((v, i) => (i === index ? value : v)));
  }
  function updateCell(rowIndex, colIndex, value) {
    setRows((r) => r.map((row, ri) => (ri === rowIndex ? row.map((c, ci) => (ci === colIndex ? value : c)) : row)));
  }
  function addColumn() {
    setHeaders((h) => [...h, `Header ${h.length + 1}`]);
    setAlignments((a) => [...a, 'left']);
    setRows((r) => r.map((row) => [...row, '']));
  }
  function removeColumn() {
    if (headers.length <= 1) return;
    setHeaders((h) => h.slice(0, -1));
    setAlignments((a) => a.slice(0, -1));
    setRows((r) => r.map((row) => row.slice(0, -1)));
  }
  function addRow() {
    setRows((r) => [...r, headers.map(() => '')]);
  }
  function removeRow() {
    setRows((r) => (r.length > 1 ? r.slice(0, -1) : r));
  }
  const markdown = buildMarkdown(headers, rows, alignments);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Markdown Table Generator</h1>
      <p className="tool-description">
        Build a table visually - add or remove rows and columns, edit cell text, and set per-column
        alignment - then get the properly padded Markdown table syntax. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={addColumn}>Add column</button>
        <button onClick={removeColumn} disabled={headers.length <= 1}>Remove column</button>
        <button onClick={addRow}>Add row</button>
        <button onClick={removeRow} disabled={rows.length <= 1}>Remove row</button>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
      </div>
      <div className="tool-panel">
        <label>Table builder</label>
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table">
            <thead>
              <tr>
                {headers.map((h, c) => (
                  <th key={c}>
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHeader(c, e.target.value)}
                      style={{ width: '100%', marginBottom: 6 }}
                    />
                    <select value={alignments[c]} onChange={(e) => updateAlignment(c, e.target.value)}>
                      {ALIGNMENTS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="md-table-output">Markdown</label>
        <textarea id="md-table-output" value={markdown} readOnly spellCheck={false} style={{ minHeight: 160 }} />
      </div>
    </div>
  );
}
