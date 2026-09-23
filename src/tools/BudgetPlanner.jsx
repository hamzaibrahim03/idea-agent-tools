import { useEffect, useState } from 'react';
export default function BudgetPlanner() {
    const [income, setIncome] = useState('4000');
    const [categories, setCategories] = useState([
        { name: 'Needs (rent, bills, groceries)', amount: '2000', targetPercent: '50' },
        { name: 'Wants (dining, entertainment)', amount: '1200', targetPercent: '30' },
        { name: 'Savings & debt payoff', amount: '800', targetPercent: '20' }
    ]);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    function updateCategory(index, field, value) {
        setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
    }
    function addCategory() {
        setCategories((prev) => [...prev, { name: '', amount: '', targetPercent: '' }]);
    }
    function removeCategory(index) {
        setCategories((prev) => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/budget-planner', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { income, categories } })
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
    }, [income, categories]);
    const { valid, rows, totalAllocated, totalTargetPercent, remaining } = data || {};
    return (
        <div className="tool-page">
            <h1>Budget Planner</h1>
            <p className="tool-description">
                Enter your monthly income and a set of budget categories with allocated amounts and
                adjustable target percentages (defaults to a 50/30/20-style split) to see remaining
                unallocated income and how your actual spending compares to your targets.
            </p>
            <div className="tool-panel">
                <label htmlFor="budget-income">Monthly income</label>
                <input id="budget-income" type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} style={{ maxWidth: '200px' }} />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={addCategory}>
                    Add category
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Allocated amount</th>
                            <th>Target %</th>
                            <th>Actual %</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={c.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={c.amount} onChange={(e) => updateCategory(i, 'amount', e.target.value)} style={{ width: '100px' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={c.targetPercent} onChange={(e) => updateCategory(i, 'targetPercent', e.target.value)} style={{ width: '70px' }} />
                                </td>
                                <td>
                                    <code>{(rows?.[i]?.actualPct ?? 0).toFixed(1)}%</code>
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeCategory(i)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive monthly income.
                </div>
            )}
            {valid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Total allocated:</strong> <code>{totalAllocated.toFixed(2)}</code>
                    </div>
                    <div>
                        <strong>Remaining unallocated income:</strong> <code>{remaining.toFixed(2)}</code>
                    </div>
                    <div>
                        <strong>Total target percentage:</strong> <code>{totalTargetPercent.toFixed(1)}%</code>
                        {Math.round(totalTargetPercent) !== 100 && ' (targets do not add up to 100%)'}
                    </div>
                </div>
            )}
        </div>
    );
}
