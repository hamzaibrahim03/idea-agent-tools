import { useState } from 'react';
function daysUntilNextBirthday(birthDateStr) {
  const birth = new Date(`${birthDateStr}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthMonth = birth.getMonth();
  const birthDay = birth.getDate();
  const isLeapDay = birthMonth === 1 && birthDay === 29;
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
  function birthdayInYear(year) {
    if (isLeapDay && !isLeapYear(year)) return new Date(year, 1, 28);
    return new Date(year, birthMonth, birthDay);
  }
  let next = birthdayInYear(today.getFullYear());
  if (next < today) {
    next = birthdayInYear(today.getFullYear() + 1);
  }
  const daysRemaining = Math.round((next - today) / 86400000);
  const turningAge = next.getFullYear() - birth.getFullYear();
  return { daysRemaining, nextDate: next, turningAge, isToday: daysRemaining === 0 };
}
export default function NextBirthdayCountdown() {
  const [birthDate, setBirthDate] = useState('2000-06-15');
  const result = daysUntilNextBirthday(birthDate);
  return (
    <div className="tool-page">
      <h1>Next Birthday Countdown</h1>
      <p className="tool-description">
        Calculate how many days remain until your next birthday, automatically rolling to next
        year if this year's has already passed. Feb 29 birthdays are observed on Feb 28 in
        non-leap years. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Birth date:
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </label>
      </div>
      {!result && <div className="tool-error">Please enter a valid date.</div>}
      {result && (
        <div className="timestamp-result">
          {result.isToday ? (
            <span>
              <strong>Today is the big day!</strong> Turning {result.turningAge}.
            </span>
          ) : (
            <span>
              <strong>Days remaining:</strong> {result.daysRemaining}
            </span>
          )}
          <span>
            <strong>Next birthday:</strong> {result.nextDate.toDateString()}
          </span>
          <span>
            <strong>Turning:</strong> {result.turningAge}
          </span>
        </div>
      )}
    </div>
  );
}
