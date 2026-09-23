import { useEffect, useState } from 'react';
function pad(n) {
  return String(n).padStart(2, '0');
}
function toDatetimeLocalValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export default function TimeUntilCalculator() {
  const [target, setTarget] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return toDatetimeLocalValue(d);
  });
  const [result, setResult] = useState({ valid: false, breakdown: null, formatted: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/time-until-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { target } })
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
  }, [target]);
  const { valid, breakdown, formatted } = result;
  return (
    <div className="tool-page">
      <h1>Time Until Calculator</h1>
      <p className="tool-description">
        See a human-readable breakdown of time remaining until a target date and time (e.g. "3
        months, 2 weeks, 4 days, 6 hours"), using a calendar-aware month/week/day breakdown rather
        than a raw duration. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Target date/time:
          <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
      </div>
      {!valid && <div className="tool-error">Please enter a valid date and time.</div>}
      {valid && !breakdown && (
        <div className="tool-error">Target must be in the future.</div>
      )}
      {breakdown && (
        <div className="timestamp-result">
          <span>
            <strong>Time remaining:</strong> {formatted}
          </span>
        </div>
      )}
    </div>
  );
}
