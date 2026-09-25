import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const CLAUSE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'JOIN',
  'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'ON'
];
const SORTED_KEYWORDS = [...CLAUSE_KEYWORDS].sort((a, b) => b.length - a.length);
function formatSql(sql) {
  let normalized = sql.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  for (const kw of SORTED_KEYWORDS) {
    const regex = new RegExp(`\\s*\\b${kw.replace(' ', '\\s+')}\\b\\s*`, 'gi');
    normalized = normalized.replace(regex, `\n${kw} `);
  }
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const formatted = lines.map((line) => {
    const isSelect = /^SELECT\b/i.test(line);
    if (isSelect && line.includes(',')) {
      const [, rest] = line.split(/^SELECT\s+/i);
      const cols = rest.split(',').map((c) => c.trim());
      return `SELECT\n  ${cols.join(',\n  ')}`;
    }
    const clauseMatch = SORTED_KEYWORDS.find((kw) => new RegExp(`^${kw}\\b`, 'i').test(line));
    if (clauseMatch && line.length > clauseMatch.length) {
      return `${clauseMatch}\n  ${line.slice(clauseMatch.length).trim()}`;
    }
    return line;
  });
  return formatted.join('\n');
}
const SAMPLE_SQL =
  'select id, name, email from users left join orders on users.id = orders.user_id where users.active = true group by users.id order by users.name limit 50';
export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [copied, setCopied] = useState(false);
  const formatted = formatSql(input);
  async function handleCopy() {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(formatted, 'formatted.sql', 'application/sql');
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
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!formatted}>
          {copied ? 'Copied!' : 'Copy formatted SQL'}
        </button>
        <button onClick={handleDownload} disabled={!formatted}>
          Download
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
