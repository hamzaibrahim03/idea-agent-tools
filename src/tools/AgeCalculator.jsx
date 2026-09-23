import { useEffect, useState } from 'react';
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('2000-01-01');
    const [onDate, setOnDate] = useState(todayStr());
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/age-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { birthDate, onDate } })
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
    }, [birthDate, onDate]);
    return (
        <div className="tool-page">
            <h1>Age Calculator</h1>
            <p className="tool-description">
                Calculate exact age (or the time between two dates) in years, months, and days.
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
            {error && <div className="agent-error">{error}</div>}
            {!result && !error && <div className="tool-error">Birth date must be a valid date on or before the "as of" date.</div>}
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
