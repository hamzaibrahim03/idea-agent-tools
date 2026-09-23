import { useEffect, useState } from 'react';
export default function SqlDataTypeReference() {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/sql-data-type-reference', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { query } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setFiltered(data.types);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);
  return (
    <div className="tool-page">
      <h1>SQL Data Type Reference</h1>
      <p className="tool-description">
        A searchable reference table of common SQL data types across MySQL, PostgreSQL, and SQLite,
        with size limits and usage notes for each. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search types (e.g. text, date, boolean)"
          style={{ flex: 1, minWidth: 220, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
        />
      </div>
      <div className="tool-panel">
        <label>Data types ({filtered.length})</label>
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>MySQL</th>
                <th>PostgreSQL</th>
                <th>SQLite</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.name}>
                  <td><code>{t.name}</code></td>
                  <td>{t.mysql}</td>
                  <td>{t.postgres}</td>
                  <td>{t.sqlite}</td>
                  <td>{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="tool-placeholder">No data types match your search.</p>}
      </div>
    </div>
  );
}
