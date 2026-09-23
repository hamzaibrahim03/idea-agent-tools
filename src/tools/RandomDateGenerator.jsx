import { useState } from 'react';
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}
function formatDisplay(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}
export default function RandomDateGenerator() {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [count, setCount] = useState(1);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  function handleGenerate() {
    setError('');
    fetch('/api/tools/random-date-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { startDate, endDate, count, excludeWeekends } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else if (data.error === '') {
          setResults((data.resultsIso || []).map((iso) => new Date(iso)));
        }
      })
      .catch((e) => setError(e.message || 'Failed to generate'));
  }
  async function handleCopy() {
    if (results.length === 0) return;
    try {
      await navigator.clipboard.writeText(results.map(formatDate).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Date Generator</h1>
      <p className="tool-description">
        Pick one or more random dates within a date range, using your browser's
        cryptographically-random source, with an option to exclude weekends. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Start:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          How many:
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={excludeWeekends}
            onChange={(e) => setExcludeWeekends(e.target.checked)}
          />
          Exclude weekends
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={results.length === 0}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {results.length > 0 && (
        <ul className="uuid-list">
          {results.map((d, i) => (
            <li key={i}>
              <span>{formatDisplay(d)}</span>
              <code>{formatDate(d)}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
