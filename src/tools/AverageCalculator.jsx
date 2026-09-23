import { useEffect, useState } from 'react';
export default function AverageCalculator() {
    const [input, setInput] = useState('4, 8, 15, 16, 23, 42');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/average-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
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
    }, [input]);
    const valid = data?.valid;
    return (
        <div className="tool-page">
            <h1>Average (Mean) Calculator</h1>
            <p className="tool-description">
                Calculate the mean, median, sum, minimum, and maximum of a list of numbers.
            </p>
            <div className="tool-panel">
                <label htmlFor="avg-input">Numbers (comma or space separated)</label>
                <textarea id="avg-input" value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
            </div>
            {error && <div className="agent-error">{error}</div>}
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter at least one valid number.
                </div>
            )}
            {valid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Count:</strong> {data.count}
                    </div>
                    <div>
                        <strong>Sum:</strong> {data.sum}
                    </div>
                    <div>
                        <strong>Mean (average):</strong> {data.mean.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
                    </div>
                    <div>
                        <strong>Median:</strong> {data.median}
                    </div>
                    <div>
                        <strong>Min / Max:</strong> {data.min} / {data.max}
                    </div>
                </div>
            )}
        </div>
    );
}
