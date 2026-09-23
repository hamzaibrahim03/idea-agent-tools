import { useEffect, useState } from 'react';
export default function FractionCalculator() {
    const [num1, setNum1] = useState('1');
    const [den1, setDen1] = useState('2');
    const [op, setOp] = useState('add');
    const [num2, setNum2] = useState('1');
    const [den2, setDen2] = useState('3');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/fraction-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { num1, den1, op, num2, den2 } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) { setError(d.error); setData(null); }
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [num1, den1, op, num2, den2]);
    const { result, decimal, mixed } = data || {};
    return (
        <div className="tool-page">
            <h1>Fraction Calculator</h1>
            <p className="tool-description">
                Add, subtract, multiply, or divide two fractions, with the result automatically
                simplified to lowest terms.
            </p>
            <div className="tool-controls">
                <label>
                    <input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} style={{ width: '60px' }} />
                </label>
                <span>/</span>
                <label>
                    <input type="number" value={den1} onChange={(e) => setDen1(e.target.value)} style={{ width: '60px' }} />
                </label>
                <select value={op} onChange={(e) => setOp(e.target.value)}>
                    <option value="add">+</option>
                    <option value="sub">−</option>
                    <option value="mul">×</option>
                    <option value="div">÷</option>
                </select>
                <label>
                    <input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} style={{ width: '60px' }} />
                </label>
                <span>/</span>
                <label>
                    <input type="number" value={den2} onChange={(e) => setDen2(e.target.value)} style={{ width: '60px' }} />
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
                        <strong>Result:</strong> {result.num}/{result.den}
                    </div>
                    {mixed && (
                        <div>
                            <strong>Mixed number:</strong> {mixed.whole}{' '}
                            {mixed.remainder !== 0 && `${mixed.remainder}/${Math.abs(result.den)}`}
                        </div>
                    )}
                    <div>
                        <strong>Decimal:</strong> {decimal.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}
                    </div>
                </div>
            )}
        </div>
    );
}
