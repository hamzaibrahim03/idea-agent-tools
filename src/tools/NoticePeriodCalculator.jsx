import { useState } from 'react';
const todayStr = () => new Date().toISOString().slice(0, 10);
function addDaysSkippingWeekends(start, totalDays, excludeWeekends) {
  const cursor = new Date(start);
  if (!excludeWeekends) {
    cursor.setUTCDate(cursor.getUTCDate() + totalDays);
    return cursor;
  }
  let remaining = totalDays;
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return cursor;
}
export default function NoticePeriodCalculator() {
  const [resignationDate, setResignationDate] = useState(todayStr());
  const [unit, setUnit] = useState('weeks');
  const [length, setLength] = useState('2');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const start = new Date(`${resignationDate}T12:00:00Z`);
  const lengthNum = Number(length);
  const valid = !Number.isNaN(start.getTime()) && Number.isFinite(lengthNum) && lengthNum > 0;
  let lastDay = null;
  let totalCalendarDays = 0;
  if (valid) {
    totalCalendarDays = unit === 'weeks' ? lengthNum * 7 : lengthNum;
    lastDay = addDaysSkippingWeekends(start, totalCalendarDays, excludeWeekends);
  }
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
      {!valid && <div className="tool-error">Enter a valid resignation date and a notice period length greater than 0.</div>}
      {valid && lastDay && (
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
