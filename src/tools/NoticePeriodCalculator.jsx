import { useEffect, useState } from 'react';
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function NoticePeriodCalculator() {
  const [resignationDate, setResignationDate] = useState(todayStr());
  const [unit, setUnit] = useState('weeks');
  const [length, setLength] = useState('2');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/notice-period-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { resignationDate, unit, length, excludeWeekends } })
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
  }, [resignationDate, unit, length, excludeWeekends]);
  const valid = result?.valid ?? false;
  const lastDay = valid && result?.lastDayIso ? new Date(result.lastDayIso) : null;
  const totalCalendarDays = result?.totalCalendarDays ?? 0;
  const dayLabel = lastDay
    ? lastDay.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : null;
  return (
    <div className="tool-page">
      <h1>Notice Period Calculator</h1>
      <p className="tool-description">
        Enter your resignation date and notice period length to calculate your last working day.
        Optionally count only weekdays (Monday-Friday) instead of calendar days. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Resignation date:
          <input type="date" value={resignationDate} onChange={(e) => setResignationDate(e.target.value)} />
        </label>
        <label>
          Notice period:
          <input type="number" min={1} value={length} onChange={(e) => setLength(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="weeks">Weeks</option>
            <option value="days">Days</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={excludeWeekends} onChange={(e) => setExcludeWeekends(e.target.checked)} />
          Count weekdays only (exclude Sat/Sun)
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && <div className="tool-error">Enter a valid resignation date and a notice period length greater than 0.</div>}
      {!error && valid && lastDay && (
        <div className="timestamp-result">
          <div>
            <strong>Last working day:</strong> {dayLabel}
          </div>
          <div>
            <strong>ISO date:</strong> {lastDay.toISOString().slice(0, 10)}
          </div>
          <div>
            <strong>Counting method:</strong> {excludeWeekends ? `${totalCalendarDays} weekday(s), weekends excluded` : `${totalCalendarDays} calendar day(s)`}
          </div>
        </div>
      )}
    </div>
  );
}
