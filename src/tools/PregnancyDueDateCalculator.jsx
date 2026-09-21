import { useState } from 'react';
const MS_PER_DAY = 1000 * 60 * 60 * 24;
function estimateDueDate(lmpDate) {
  const lmp = new Date(lmpDate);
  if (Number.isNaN(lmp.getTime())) return null;
  const dueDate = new Date(lmp.getTime() + 280 * MS_PER_DAY);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lmpMidnight = new Date(lmp);
  lmpMidnight.setHours(0, 0, 0, 0);
  const daysSinceLmp = Math.floor((today - lmpMidnight) / MS_PER_DAY);
  const gestationalWeeks = Math.floor(daysSinceLmp / 7);
  const gestationalDays = daysSinceLmp % 7;
  return { dueDate, daysSinceLmp, gestationalWeeks, gestationalDays };
}
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function PregnancyDueDateCalculator() {
  const [lmpDate, setLmpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 42);
    return d.toISOString().slice(0, 10);
  });
  const result = estimateDueDate(lmpDate);
  const inFuture = result && result.daysSinceLmp < 0;
  return (
    <div className="tool-page">
      <h1>Pregnancy Due Date Calculator</h1>
      <p className="tool-description">
        Estimate a pregnancy due date using Naegele's rule (280 days, or 40 weeks, from the first
        day of the last menstrual period), and see the current gestational age. Runs entirely in
        your browser. This is a general estimate only, not a medical diagnosis - actual due dates
        vary and only around 5% of babies arrive on the estimated date. Consult a healthcare
        provider for personalized dating, especially if based on conception date or ultrasound.
      </p>
      <div className="tool-controls">
        <label>
          First day of last menstrual period:
          <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} />
        </label>
        <button onClick={() => setLmpDate(todayStr())}>Today</button>
      </div>
      {!result && <div className="tool-error">Enter a valid date.</div>}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Estimated due date:</strong>{' '}
            {result.dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {!inFuture ? (
            <div>
              <strong>Current gestational age:</strong> {result.gestationalWeeks} weeks, {result.gestationalDays} days
            </div>
          ) : (
            <div>
              <strong>Note:</strong> Last menstrual period is in the future - gestational age can't be calculated yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
