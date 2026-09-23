import { useEffect, useState } from 'react';
const SAMPLE_SQL =
  'select id, name, email from users left join orders on users.id = orders.user_id where users.active = true group by users.id order by users.name limit 50';
export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/sql-formatter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setFormatted(data.formatted);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  async function handleCopy() {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>SQL Formatter</h1>
      <p className="tool-description">
        Paste a SQL query to pretty-print it, with clauses like SELECT, FROM, WHERE, JOIN, GROUP
        BY, and ORDER BY placed on their own lines with consistent indentation. This is a basic
        line-based formatter, not a full SQL parser, so unusual or deeply nested queries may not
        format perfectly. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!formatted}>
          {copied ? 'Copied!' : 'Copy formatted SQL'}
        </button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sql-input">Input</label>
          <textarea
            id="sql-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select * from table_name where ..."
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="sql-output">Formatted</label>
          <textarea id="sql-output" value={formatted} readOnly spellCheck={false} placeholder="Formatted SQL will appear here" />
        </div>
      </div>
    </div>
  );
}
