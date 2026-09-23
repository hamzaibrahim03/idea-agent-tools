import { useEffect, useState } from 'react';
const BENCHMARK_LOW = 65;
const BENCHMARK_HIGH = 70;
export default function CartAbandonmentRateCalculator() {
    const [carts, setCarts] = useState('1000');
    const [purchases, setPurchases] = useState('300');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/cart-abandonment-rate-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { carts, purchases } })
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
    }, [carts, purchases]);
    return (
        <div className="tool-page">
            <h1>Cart Abandonment Rate Calculator</h1>
            <p className="tool-description">
                Enter the number of carts created and the number of completed purchases to calculate your
                cart abandonment rate. Also shows a commonly-cited industry reference range for context -
                this is a general figure from widely-cited industry studies, not a guarantee or live
                benchmark.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ca-carts">Carts created</label>
                    <input id="ca-carts" type="number" min={0} step="1" value={carts} onChange={(e) => setCarts(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ca-purchases">Completed purchases</label>
                    <input id="ca-purchases" type="number" min={0} step="1" value={purchases} onChange={(e) => setPurchases(e.target.value)} />
                </div>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {!result ? (
                <div className="tool-error">Enter a number of carts created greater than 0.</div>
            ) : (
                <div className="timestamp-result">
                    <span>
                        <strong>Abandoned carts:</strong> {result.abandoned}
                    </span>
                    <span>
                        <strong>Cart abandonment rate:</strong> {result.rate.toFixed(1)}%
                    </span>
                    <span>
                        <strong>Industry reference:</strong> commonly cited e-commerce abandonment rates fall
                        around {BENCHMARK_LOW}-{BENCHMARK_HIGH}% (general reference figure, not a guarantee)
                    </span>
                </div>
            )}
        </div>
    );
}
