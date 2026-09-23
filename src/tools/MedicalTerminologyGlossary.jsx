import { useEffect, useState } from 'react';
export default function MedicalTerminologyGlossary() {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/medical-terminology-glossary', {
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
      <h1>Medical Terminology Glossary</h1>
      <p className="tool-description">
        Search a curated reference glossary of common medical terms and abbreviations, with
        plain-English definitions.
      </p>
      <div className="tool-error">
        <strong>Not medical advice:</strong> This is a general reference glossary for common terms
        and abbreviations only. It does not interpret your personal health information or provide
        medical guidance. Consult a healthcare professional for anything specific to your care.
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Search:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. BP, NPO, deductible"
            style={{ width: '220px' }}
          />
        </label>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.term}>
                <td><code>{entry.term}</code></td>
                <td>{entry.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="tool-error">No terms match your search.</div>
      )}
    </div>
  );
}
