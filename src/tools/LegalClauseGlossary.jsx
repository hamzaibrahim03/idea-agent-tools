import { useEffect, useState } from 'react';
export default function LegalClauseGlossary() {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/legal-clause-glossary', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { query } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else setFiltered(data.filtered || []);
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);
  return (
    <div className="tool-page">
      <h1>Legal Clause Glossary</h1>
      <p className="tool-description">
        A searchable reference glossary explaining common contract clause types in plain English.
        This is a general reference tool - it does not analyze any contract you upload or paste in.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> These are general, simplified explanations for
        educational purposes only. Clause meaning and enforceability can vary by jurisdiction and
        specific wording - consult a qualified lawyer for advice on any actual contract.
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-panel">
        <label htmlFor="clause-search">Search</label>
        <input
          id="clause-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. arbitration, liability, non-compete"
        />
      </div>
      {filtered.length === 0 && <p className="tool-placeholder">No matching clause types for "{query}".</p>}
      {filtered.map((c) => (
        <div className="tool-panel" key={c.term}>
          <label>{c.term}</label>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.85 }}>{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
