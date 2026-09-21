import { useState } from 'react';
function pad(n) {
  return String(n).padStart(2, '0');
}
function toDatetimeLocalValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function breakdownTimeUntil(fromDate, toDate) {
  if (toDate <= fromDate) return null;
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let cursor = new Date(fromDate);
  cursor.setFullYear(cursor.getFullYear() + years);
  cursor.setMonth(cursor.getMonth() + months);
  if (cursor > toDate) {
    months -= 1;
    cursor = new Date(fromDate);
    cursor.setFullYear(fromDate.getFullYear() + years);
    cursor.setMonth(fromDate.getMonth() + months);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
    cursor = new Date(fromDate);
    cursor.setFullYear(fromDate.getFullYear() + years);
    cursor.setMonth(fromDate.getMonth() + months);
  }
  let remainingMs = toDate.getTime() - cursor.getTime();
  const msPerMinute = 60000;
  const msPerHour = 3600000;
  const msPerDay = 86400000;
  const msPerWeek = msPerDay * 7;
  const weeks = Math.floor(remainingMs / msPerWeek);
  remainingMs -= weeks * msPerWeek;
  const days = Math.floor(remainingMs / msPerDay);
  remainingMs -= days * msPerDay;
  const hours = Math.floor(remainingMs / msPerHour);
  remainingMs -= hours * msPerHour;
  const minutes = Math.floor(remainingMs / msPerMinute);
  return { years, months, weeks, days, hours, minutes };
}
function formatBreakdown(b) {
  const units = [
    ['year', b.years],
    ['month', b.months],
    ['week', b.weeks],
    ['day', b.days],
    ['hour', b.hours],
    ['minute', b.minutes]
  ].filter(([, value]) => value > 0);
  if (units.length === 0) return 'Less than a minute';
  return units.map(([label, value]) => `${value} ${label}${value === 1 ? '' : 's'}`).join(', ');
}
export default function TimeUntilCalculator() {
  const [target, setTarget] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return toDatetimeLocalValue(d);
  });
  const targetDate = target ? new Date(target) : null;
  const valid = targetDate && !Number.isNaN(targetDate.getTime());
  const breakdown = valid ? breakdownTimeUntil(new Date(), targetDate) : null;
  return (
    <div className="tool-page">
      <h1>Time Until Calculator</h1>
      <p className="tool-description">
        See a human-readable breakdown of time remaining until a target date and time (e.g. "3
        months, 2 weeks, 4 days, 6 hours"), using a calendar-aware month/week/day breakdown rather
        than a raw duration. Runs entirely in your browser.
      </p>
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
            <strong>Time remaining:</strong> {formatBreakdown(breakdown)}
          </span>
        </div>
      )}
    </div>
  );
}
