import { useEffect, useState } from 'react';
let nextId = 1;
function makeDefaultDays(count) {
    return Array.from({ length: count }, () => ({ id: nextId++, weight: 1 }));
}
export default function DailyTravelBudgetSplitter() {
    const [totalBudget, setTotalBudget] = useState('1000');
    const [numDays, setNumDays] = useState(5);
    const [days, setDays] = useState(() => makeDefaultDays(5));
    const [useWeights, setUseWeights] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    function handleDaysChange(value) {
        const n = Math.max(1, parseInt(value, 10) || 1);
        setNumDays(n);
        setDays((prev) => {
            if (n > prev.length) {
                return [...prev, ...makeDefaultDays(n - prev.length)];
            }
            return prev.slice(0, n);
        });
    }
    function updateWeight(id, value) {
        setDays((d) => d.map((day) => (day.id === id ? { ...day, weight: Math.max(0, parseFloat(value) || 0) } : day)));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/daily-travel-budget-splitter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { totalBudget, days } })
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
    }, [totalBudget, days]);
    const budget = data?.budget ?? 0;
    const totalWeight = data?.totalWeight ?? 0;
    const evenPerDay = data?.evenPerDay ?? 0;
    const weightedAmounts = data?.weightedAmounts ?? [];
    return (
        <div className="tool-page">
            <h1>Daily Travel Budget Splitter</h1>
            <p className="tool-description">
                Enter your total trip budget and number of days to compute an even daily spending allowance,
                or switch on weighted split to allocate more to some days (e.g. a splurge day) and less to
                others.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="dbs-budget">Total trip budget</label>
                    <input id="dbs-budget" type="number" min="0" step="0.01" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="dbs-days">Number of days</label>
                    <input id="dbs-days" type="number" min="1" value={numDays} onChange={(e) => handleDaysChange(e.target.value)} />
                </div>
            </div>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="checkbox" checked={useWeights} onChange={(e) => setUseWeights(e.target.checked)} />
                    Allocate more/less to specific days (weighted split)
                </label>
            </div>
            {useWeights && (
                <div className="tool-panel">
                    <label>Day weights (higher = more budget that day; 1 = average)</label>
                    {days.map((day, i) => (
                        <div key={day.id} className="tool-controls" style={{ marginBottom: 6 }}>
                            <span style={{ width: 60 }}>Day {i + 1}</span>
                            <input type="number" min="0" step="0.1" value={day.weight} onChange={(e) => updateWeight(day.id, e.target.value)} style={{ width: '80px' }} />
                            <span>
                                {(weightedAmounts[i] ?? 0).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {budget > 0 && (
                <div className="timestamp-result">
                    <span>
                        <strong>Even daily allowance:</strong> {evenPerDay.toFixed(2)} / day
                    </span>
                    {useWeights && totalWeight > 0 && (
                        <span>Weighted amounts shown next to each day above (total weight: {totalWeight}).</span>
                    )}
                </div>
            )}
        </div>
    );
}
