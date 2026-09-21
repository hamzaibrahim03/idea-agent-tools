import { useState } from 'react';
function calculateAge(birthDate, onDate) {
  const birth = new Date(birthDate);
  const on = new Date(onDate);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(on.getTime())) return null;
  if (birth > on) return null;
  let years = on.getFullYear() - birth.getFullYear();
  let months = on.getMonth() - birth.getMonth();
  let days = on.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(on.getFullYear(), on.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((on - birth) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [onDate, setOnDate] = useState(todayStr());
  const result = calculateAge(birthDate, onDate);
  return (
    <div className="tool-page">
      <h1>Age Calculator</h1>
      <p className="tool-description">
        Calculate exact age (or the time between two dates) in years, months, and days. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Birth date:
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </label>
        <label>
          As of:
          <input type="date" value={onDate} onChange={(e) => setOnDate(e.target.value)} />
        </label>
        <button onClick={() => setOnDate(todayStr())}>Today</button>
      </div>
      {!result && <div className="tool-error">Birth date must be a valid date on or before the "as of" date.</div>}
      {result && (
        <div className="timestamp-result">
          <span>
            <strong>Age:</strong> {result.years} years, {result.months} months, {result.days} days
          </span>
          <span>
            <strong>Total days:</strong> {result.totalDays.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
