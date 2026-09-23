import { useEffect, useState } from 'react';
export default function InflationCalculator() {
    const [amount, setAmount] = useState('1000');
    const [startYear, setStartYear] = useState('2000');
    const [endYear, setEndYear] = useState('2026');
    const [rate, setRate] = useState('3');
    const [valid, setValid] = useState(true);
    const [result, setResult] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/inflation-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { amount, startYear, endYear, rate } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setResult(data.valid ? data.result : null);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [amount, startYear, endYear, rate]);
    const isFuture = result && result.years >= 0;
    return (
        <div className="tool-page">
            <h1>Inflation Calculator</h1>
            <p className="tool-description">
                Calculate the equivalent purchasing-power-adjusted value of an amount between two years,
                using a compound annual inflation rate that you provide (this tool does not look up
                historical inflation data). Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Amount:
                    <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Start year:
                    <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    End year:
                    <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    Average annual inflation rate (%):
                    <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
                </label>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a non-negative amount, whole number years, and a numeric inflation rate.
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>
                            Equivalent value in {endYear}:
                        </strong>{' '}
                        {result.adjustedAmount.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of years:</strong> {Math.abs(result.years)} {isFuture ? '(forward)' : '(backward)'}
                    </div>
                </div>
            )}
        </div>
    );
}
