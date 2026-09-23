import { useEffect, useState } from 'react';
export default function SavingsGoalCalculator() {
  const [target, setTarget] = useState('10000');
  const [current, setCurrent] = useState('1000');
  const [monthly, setMonthly] = useState('200');
  const [rate, setRate] = useState('4');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/savings-goal-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { target, current, monthly, rate } })
      })
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          if (d.error) setError(d.error);
          else setData(d);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [target, current, monthly, rate]);
  const valid = data?.valid ?? false;
  const months = data?.months ?? null;
  const totalContributed = data?.totalContributed ?? null;
  const years = months !== null ? Math.floor(months / 12) : null;
  const remMonths = months !== null ? months % 12 : null;
  return (
    <div className="tool-page">
      <h1>Savings Goal Calculator</h1>
      <p className="tool-description">
        Work out how many months it will take to reach a savings target, given what you already
        have saved, a regular monthly contribution, and an expected annual interest rate. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Target amount:
          <input type="number" min={0} value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Current savings:
          <input type="number" min={0} value={current} onChange={(e) => setCurrent(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Monthly contribution:
          <input type="number" min={0} value={monthly} onChange={(e) => setMonthly(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual interest rate (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive target, and non-negative current savings, contribution, and rate.
        </div>
      )}
      {valid && months === null && (
        <div className="tool-error">
          <strong>Error:</strong> With a $0 monthly contribution and no interest, this goal can never be reached. Add a monthly contribution.
        </div>
      )}
      {months !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Time to reach goal:</strong> {months} month{months === 1 ? '' : 's'} ({years} year{years === 1 ? '' : 's'}
            {remMonths ? `, ${remMonths} month${remMonths === 1 ? '' : 's'}` : ''})
          </div>
          <div>
            <strong>Total contributed:</strong> {totalContributed.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
