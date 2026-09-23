import { useEffect, useState } from 'react';
export default function FreelanceRateCalculator() {
    const [desiredIncome, setDesiredIncome] = useState('80000');
    const [billableHours, setBillableHours] = useState('25');
    const [weeksPerYear, setWeeksPerYear] = useState('48');
    const [overhead, setOverhead] = useState('10000');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/freelance-rate-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { desiredIncome, billableHours, weeksPerYear, overhead } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) { setError(data.error); setResult(null); }
                    else setResult(data.result);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [desiredIncome, billableHours, weeksPerYear, overhead]);
    return (
        <div className="tool-page">
            <h1>Freelance Rate Calculator</h1>
            <p className="tool-description">
                Calculate the minimum hourly rate you need to charge to hit a desired annual income, based
                on your billable hours per week, weeks worked per year, and business overhead or
                expenses.
            </p>
            <div className="tool-controls">
                <label>
                    Desired annual income:
                    <input type="number" min={0} value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} style={{ width: '110px' }} />
                </label>
                <label>
                    Billable hours/week:
                    <input type="number" min={0} value={billableHours} onChange={(e) => setBillableHours(e.target.value)} style={{ width: '90px' }} />
                </label>
                <label>
                    Weeks worked/year:
                    <input type="number" min={0} max={52} value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    Annual overhead/expenses:
                    <input type="number" min={0} value={overhead} onChange={(e) => setOverhead(e.target.value)} style={{ width: '110px' }} />
                </label>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Minimum hourly rate:</strong> {result.rate.toFixed(2)}
                    </div>
                    <div>
                        <strong>Billable hours/year:</strong> {result.billableHoursPerYear.toLocaleString()}
                    </div>
                    <div>
                        <strong>Required annual revenue:</strong> {result.requiredRevenue.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
