import { useState, useMemo } from 'react';

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

  function toggleFlag(key) {
    setFlags((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));
  }

  const { error, matches, highlighted } = useMemo(() => {
    if (!pattern) return { error: '', matches: [], highlighted: null };
    try {
      const re = new RegExp(pattern, flags.join(''));
      if (!testString) return { error: '', matches: [], highlighted: null };

      // Always scan with 'g' internally so we can find every match for
      // highlighting/counting, regardless of whether the user's own flags
      // include it - re-including 'g' twice would throw, so build a
      // separate global-scanning regex from the same pattern/flags.
      const scanFlags = flags.includes('g') ? flags.join('') : `${flags.join('')}g`;
      const scanRe = new RegExp(pattern, scanFlags);

      const found = [...testString.matchAll(scanRe)];
      const segments = [];
      let lastIndex = 0;
      for (const m of found) {
        if (m.index > lastIndex) segments.push({ text: testString.slice(lastIndex, m.index), match: false });
        segments.push({ text: m[0], match: true });
        lastIndex = m.index + m[0].length;
        // matchAll on a zero-length match (e.g. pattern "a*") would loop
        // forever without this - matchAll itself already advances past
        // zero-length matches internally, so this is just a safety guard.
        if (m[0].length === 0) lastIndex++;
      }
      if (lastIndex < testString.length) segments.push({ text: testString.slice(lastIndex), match: false });

      return { error: '', matches: found, highlighted: segments };
    } catch (e) {
      return { error: e.message, matches: [], highlighted: null };
    }
  }, [pattern, flags, testString]);

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

      {error && (
        <div className="tool-error">
          <strong>Invalid pattern:</strong> {error}
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

      {matches.length > 0 && matches.some((m) => m.length > 1) && (
        <div className="tool-panel">
          <label>Capture groups</label>
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
                  <td><code>{m[0]}</code></td>
                  <td>{m.slice(1).map((g, gi) => <code key={gi}>{g ?? '(undefined)'} </code>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
