import { useState } from 'react';
const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];
function describeField(value, name) {
  if (value === '*') return `every ${name}`;
  if (value.includes('/')) {
    const [range, step] = value.split('/');
    return `every ${step} ${name}(s)${range !== '*' ? ` within ${range}` : ''}`;
  }
  if (value.includes(',')) return `${name} in [${value}]`;
  if (value.includes('-')) return `${name} ${value}`;
  return `${name} ${value}`;
}
function describeCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Expected 5 fields: minute hour day-of-month month day-of-week');
  }
  return parts.map((p, i) => describeField(p, FIELD_NAMES[i])).join(', ');
}
function matchesField(value, current) {
  if (value === '*') return true;
  for (const part of value.split(',')) {
    if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = Number(stepStr);
      const start = range === '*' ? 0 : Number(range.split('-')[0]);
      if (current >= start && (current - start) % step === 0) return true;
    } else if (part.includes('-')) {
      const [lo, hi] = part.split('-').map(Number);
      if (current >= lo && current <= hi) return true;
    } else if (Number(part) === current) {
      return true;
    }
  }
  return false;
}
function nextRunTimes(expr, count = 5) {
  const [min, hour, dom, month, dow] = expr.trim().split(/\s+/);
  const results = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  let guard = 0;
  while (results.length < count && guard < 60 * 24 * 366) {
    guard++;
    const ok =
      matchesField(min, cursor.getMinutes()) &&
      matchesField(hour, cursor.getHours()) &&
      matchesField(dom, cursor.getDate()) &&
      matchesField(month, cursor.getMonth() + 1) &&
      matchesField(dow, cursor.getDay());
    if (ok) results.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return results;
}
export default function CronParser() {
  const [input, setInput] = useState('*/15 9-17 * * 1-5');
  const [error, setError] = useState('');
  let description = '';
  let upcoming = [];
  try {
    description = describeCron(input);
    upcoming = nextRunTimes(input);
    if (error) setError('');
  } catch (e) {
    if (!error) setError(e.message);
  }
  return (
    <div className="tool-page">
      <h1>Cron Expression Parser</h1>
      <p className="tool-description">
        Paste a standard 5-field cron expression to see a plain-English description and the next
        upcoming run times, computed in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="cron-input">Cron expression</label>
        <input
          id="cron-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="* * * * *"
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {!error && (
        <div className="timestamp-result">
          <span>
            <strong>Meaning:</strong> {description}
          </span>
          <span>
            <strong>Next runs:</strong>
          </span>
          <ul className="uuid-list">
            {upcoming.map((d, i) => (
              <li key={i}>
                <code>{d.toLocaleString()}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
