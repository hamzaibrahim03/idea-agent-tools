import { useEffect, useState } from 'react';
export default function BreakEvenCalculator() {
    const [fixedCosts, setFixedCosts] = useState('10000');
    const [variableCost, setVariableCost] = useState('20');
    const [price, setPrice] = useState('50');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/break-even-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { fixedCosts, variableCost, price } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [fixedCosts, variableCost, price]);
    const { valid, contributionMargin, breakEvenUnits, breakEvenRevenue, contributionMarginRatio } = result || {};
    return (
        <div className="tool-page">
            <h1>Break-Even Calculator</h1>
            <p className="tool-description">
                Calculate the break-even point in units and revenue given fixed costs, variable cost per
                unit, and price per unit, using the standard break-even formula (fixed costs divided by
                contribution margin per unit).
            </p>
            <div className="tool-controls">
                <label>
                    Fixed costs:
                    <input type="number" min={0} value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} style={{ width: '110px' }} />
                </label>
                <label>
                    Variable cost per unit:
                    <input type="number" min={0} value={variableCost} onChange={(e) => setVariableCost(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Price per unit:
                    <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100px' }} />
                </label>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {result && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Price per unit must be greater than variable cost per unit (a positive contribution margin), and costs must be non-negative.
                </div>
            )}
            {valid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Contribution margin per unit:</strong> <code>{contributionMargin.toFixed(2)}</code> ({contributionMarginRatio.toFixed(2)}%)
                    </div>
                    <div>
                        <strong>Break-even point:</strong> <code>{Math.ceil(breakEvenUnits)}</code> units
                    </div>
                    <div>
                        <strong>Break-even revenue:</strong> <code>{breakEvenRevenue.toFixed(2)}</code>
                    </div>
                </div>
            )}
        </div>
    );
}
