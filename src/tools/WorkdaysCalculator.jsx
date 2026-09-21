import { useState } from 'react';
function parseHolidays(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => new Date(`${line}T12:00:00Z`))
    .filter((d) => !Number.isNaN(d.getTime()))
    .map((d) => d.toISOString().slice(0, 10));
}
function countWorkdays(startStr, endStr, holidays) {
  const start = new Date(`${startStr}T12:00:00Z`);
  const end = new Date(`${endStr}T12:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (start > end) return null;
  const holidaySet = new Set(holidays);
  let count = 0;
  let totalDays = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    const iso = cursor.toISOString().slice(0, 10);
    totalDays += 1;
    if (day !== 0 && day !== 6 && !holidaySet.has(iso)) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return { count, totalDays };
}
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function WorkdaysCalculator() {
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [holidaysText, setHolidaysText] = useState('');
  const holidays = parseHolidays(holidaysText);
  const result = countWorkdays(startDate, endDate, holidays);
  return (
    <div className="tool-page">
      <h1>Workdays Calculator</h1>
      <p className="tool-description">
        Calculate the number of business days (Monday-Friday) between two dates, with an optional
        list of holiday dates to exclude. Both dates are counted as inclusive. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Start date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>
      <div className="tool-panel">
        <label htmlFor="holidays-input">Holidays to exclude (one date per line, YYYY-MM-DD)</label>
        <textarea
          id="holidays-input"
          value={holidaysText}
          onChange={(e) => setHolidaysText(e.target.value)}
          placeholder={'2026-01-01\n2026-12-25'}
        />
      </div>
      {!result && <div className="tool-error">Start date must be a valid date on or before the end date.</div>}
      {result && (
        <div className="timestamp-result">
          <span>
            <strong>Business days:</strong> {result.count}
          </span>
          <span>
            <strong>Total days in range:</strong> {result.totalDays}
          </span>
          <span>
            <strong>Holidays excluded:</strong> {holidays.length}
          </span>
        </div>
      )}
    </div>
  );
}
