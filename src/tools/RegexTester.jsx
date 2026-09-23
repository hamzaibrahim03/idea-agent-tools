import { useEffect, useState } from 'react';
const FLAG_OPTIONS = [
  { key: 'g', label: 'Global (g)' },
  { key: 'i', label: 'Case-insensitive (i)' },
  { key: 'm', label: 'Multiline (m)' },
  { key: 's', label: 'Dot-all (s)' }
];
export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState(['g']);
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState({ matches: [], highlighted: null, regexError: '' });
  const [error, setError] = useState('');
  function toggleFlag(key) {
    setFlags((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/regex-tester', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { pattern, flags, testString } })
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
  }, [pattern, flags, testString]);
  const matches = result.matches || [];
  const highlighted = result.highlighted || null;
  const regexError = result.regexError || '';
  return (
    <div className="tool-page">
      <h1>Regex Tester</h1>
      <p className="tool-description">
        Test a regular expression against sample text and see every match highlighted. Runs entirely
        in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="regex-pattern">Pattern</label>
        <div className="regex-pattern-row">
          <span className="regex-slash">/</span>
          <input
            id="regex-pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \\b\\w+@\\w+\\.\\w+\\b"
            spellCheck={false}
          />
          <span className="regex-slash">/{flags.join('')}</span>
        </div>
      </div>
      <div className="tool-controls">
        {FLAG_OPTIONS.map((f) => (
          <label key={f.key} className="checkbox-label">
            <input type="checkbox" checked={flags.includes(f.key)} onChange={() => toggleFlag(f.key)} />
            {f.label}
          </label>
        ))}
      </div>
      {error && <div className="agent-error">{error}</div>}
      {regexError && (
        <div className="tool-error">
          <strong>Invalid pattern:</strong> {regexError}
        </div>
      )}
      <div className="tool-panel">
        <label htmlFor="regex-test-string">Test string</label>
        <textarea
          id="regex-test-string"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste text to test against"
          spellCheck={false}
        />
      </div>
      <div className="tool-panel">
        <label>Result ({matches.length} match{matches.length === 1 ? '' : 'es'})</label>
        <div className="regex-highlighted">
          {highlighted
            ? highlighted.map((seg, i) => (
              <span key={i} className={seg.match ? 'regex-match' : undefined}>
                {seg.text}
              </span>
            ))
            : <span className="tool-placeholder">Matches will be highlighted here</span>}
        </div>
      </div>
      {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
        <div className="tool-panel">
          <label>Capture groups</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full match</th>
                  <th>Groups</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><code>{m.full}</code></td>
                    <td>{m.groups.map((g, gi) => <code key={gi}>{g ?? '(undefined)'} </code>)}</td>
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
