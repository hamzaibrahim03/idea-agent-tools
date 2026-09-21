import { useState } from 'react';
function randomInt(maxExclusive) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buf = new Uint32Array(1);
  let n;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % maxExclusive;
}
function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}
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
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Enter valid start and end dates.');
      setResults([]);
      return;
    }
    if (start > end) {
      setError('Start date must be on or before the end date.');
      setResults([]);
      return;
    }
    const totalDays = Math.floor((end - start) / 86400000) + 1;
    const candidateDays = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      if (!excludeWeekends || !isWeekend(d)) candidateDays.push(d);
    }
    if (candidateDays.length === 0) {
      setError('No eligible dates in that range (check the weekend exclusion).');
      setResults([]);
      return;
    }
    const howMany = Math.min(Math.max(Number(count) || 1, 1), 50);
    const picked = Array.from({ length: howMany }, () => candidateDays[randomInt(candidateDays.length)]);
    picked.sort((a, b) => a - b);
    setResults(picked);
    setCopied(false);
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
