import { useEffect, useState } from 'react';
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function PregnancyDueDateCalculator() {
  const [lmpDate, setLmpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 42);
    return d.toISOString().slice(0, 10);
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/pregnancy-due-date-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { lmpDate, nowIso: new Date().toISOString() } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data.result);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [lmpDate]);
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
      {error && <div className="agent-error">{error}</div>}
      {!error && !result && <div className="tool-error">Enter a valid date.</div>}
      {!error && result && (
        <div className="timestamp-result">
          <div>
            <strong>Estimated due date:</strong>{' '}
            {new Date(result.dueDateIso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
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
