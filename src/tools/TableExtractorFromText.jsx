import { useState, useMemo } from 'react';
function parseDelimited(text, delimiter) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const splitLine = (line) => (delimiter === '\t' ? line.split('\t') : line.split(','));
  const headers = splitLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => splitLine(line).map((c) => c.trim()));
  return { headers, rows };
}
function toMarkdown(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const dividerLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const bodyLines = rows.map((r) => `| ${headers.map((_, i) => r[i] || '').join(' | ')} |`);
  return [headerLine, dividerLine, ...bodyLines].join('\n');
}
function toCsv(headers, rows) {
  const escape = (cell) => {
    const s = String(cell ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.map(escape).join(','), ...rows.map((r) => headers.map((_, i) => escape(r[i] || '')).join(','))];
  return lines.join('\n');
}
export default function TableExtractorFromText() {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
  const [copied, setCopied] = useState('');
  const { headers, rows } = useMemo(
    () => parseDelimited(input, delimiter === 'tab' ? '\t' : ','),
    [input, delimiter]
  );
  const hasData = headers.length > 0;
  const markdown = hasData ? toMarkdown(headers, rows) : '';
  const csv = hasData ? toCsv(headers, rows) : '';
  async function handleCopy(text, which) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Table Extractor From Text</h1>
      <p className="tool-description">
        Paste tab- or comma-delimited text - like content copied straight from a spreadsheet - and
        this tool parses it into a clean table view, with copy-as-Markdown and copy-as-CSV options.
        It works only on already-structured delimited text you paste in, not on scanned images or
        PDFs. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Delimiter:
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value="tab">Tab (spreadsheet paste)</option>
            <option value="comma">Comma (CSV)</option>
          </select>
        </label>
        <button onClick={() => handleCopy(markdown, 'md')} disabled={!hasData}>
          {copied === 'md' ? 'Copied!' : 'Copy as Markdown'}
        </button>
        <button onClick={() => handleCopy(csv, 'csv')} disabled={!hasData}>
          {copied === 'csv' ? 'Copied!' : 'Copy as CSV'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="tef-input">Paste delimited text</label>
        <textarea
          id="tef-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Name\tAge\tCity\nAlice\t30\tBoston\nBob\t25\tDenver'}
          spellCheck={false}
        />
      </div>
      {hasData && (
        <div className="tool-panel">
          <label>Parsed table</label>
          <div style={{ overflowX: 'auto' }}>
            <table className="regex-groups-table">
              <thead>
                <tr>
                  {headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, r) => (
                  <tr key={r}>
                    {headers.map((_, c) => <td key={c}>{row[c] || ''}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
