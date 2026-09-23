import { useEffect, useState } from 'react';
export default function RetirementSavingsProjector() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('20000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [rate, setRate] = useState('7');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/retirement-savings-projector', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { currentAge, retirementAge, currentSavings, monthlyContribution, rate } })
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
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, rate]);
  const valid = data?.valid ?? false;
  const years = data?.years ?? null;
  const result = data?.result ?? null;
  return (
    <div className="tool-page">
      <h1>Retirement Savings Projector</h1>
      <p className="tool-description">
        Project your retirement account balance using your current savings, a regular monthly
        contribution, and an expected annual rate of return, compounded monthly. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Current age:
          <input type="number" min={0} value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Retirement age:
          <input type="number" min={0} value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Current savings:
          <input type="number" min={0} value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Monthly contribution:
          <input
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            style={{ width: '110px' }}
          />
        </label>
        <label>
          Expected annual return (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Retirement age must be greater than current age, and other fields must be non-negative.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Years until retirement:</strong> {years}
          </div>
          <div>
            <strong>Projected balance:</strong> {result.projectedBalance.toFixed(2)}
          </div>
          <div>
            <strong>Total contributed:</strong> {result.totalContributed.toFixed(2)}
          </div>
          <div>
            <strong>Total investment growth:</strong> {result.totalGrowth.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
