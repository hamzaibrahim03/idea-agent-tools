import { useEffect, useState } from 'react';
export default function TableExtractorFromText() {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
  const [copied, setCopied] = useState('');
  const [result, setResult] = useState({ headers: [], rows: [], markdown: '', csv: '', hasData: false });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/table-extractor-from-text', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input, delimiter } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input, delimiter]);
  const { headers, rows, markdown, csv, hasData } = result;
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
      {error && <div className="agent-error">{error}</div>}
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
