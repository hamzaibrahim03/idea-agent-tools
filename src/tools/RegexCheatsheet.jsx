import { useEffect, useState } from 'react';
export default function RegexCheatsheet() {
  const [query, setQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState('');
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/regex-cheatsheet', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { query } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setSections(data.sections);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);
  async function copyToken(token) {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedItem(token);
      setTimeout(() => setCopiedItem(''), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Regex Cheatsheet</h1>
      <p className="tool-description">
        A quick reference for common regular expression syntax - character classes, anchors,
        quantifiers, groups, and flags. Click any token to copy it. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="cheatsheet-search">Search</label>
        <input
          id="cheatsheet-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. lookahead, digit, boundary"
        />
      </div>
      {error && <div className="agent-error">{error}</div>}
      {sections.length === 0 && !error && <p className="tool-placeholder">No matches for "{query}".</p>}
      {sections.map((section) => (
        <div key={section.title} className="tool-panel">
          <label>{section.title}</label>
          <table className="regex-groups-table">
            <tbody>
              {section.items.map(([token, desc]) => (
                <tr key={token}>
                  <td>
                    <code onClick={() => copyToken(token)} style={{ cursor: 'pointer' }} title="Click to copy">
                      {copiedItem === token ? 'Copied!' : token}
                    </code>
                  </td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
