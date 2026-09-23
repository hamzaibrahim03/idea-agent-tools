import { useEffect, useState } from 'react';
export default function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState('1000');
    const [rate, setRate] = useState('7');
    const [years, setYears] = useState('10');
    const [compounds, setCompounds] = useState('12');
    const [monthly, setMonthly] = useState('0');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/compound-interest-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { principal, rate, years, compounds, monthly } })
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
    }, [principal, rate, years, compounds, monthly]);
    return (
        <div className="tool-page">
            <h1>Compound Interest Calculator</h1>
            <p className="tool-description">
                Calculate how an investment grows over time with compound interest, including optional
                regular monthly contributions.
            </p>
            <div className="tool-controls">
                <label>
                    Initial amount:
                    <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '110px' }} />
                </label>
                <label>
                    Annual rate (%):
                    <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    Years:
                    <input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '70px' }} />
                </label>
                <label>
                    Compounds/year:
                    <select value={compounds} onChange={(e) => setCompounds(e.target.value)}>
                        <option value="1">Annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </label>
                <label>
                    Monthly contribution:
                    <input type="number" min={0} value={monthly} onChange={(e) => setMonthly(e.target.value)} style={{ width: '100px' }} />
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
                        <strong>Final balance:</strong> {result.finalBalance.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total contributed:</strong> {result.totalContributed.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total interest earned:</strong> {result.totalInterest.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
