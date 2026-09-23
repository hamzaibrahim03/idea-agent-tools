import { useEffect, useState } from 'react';
const DEFAULT_EXPENSES = [
    { category: 'Materials', amount: '15000' },
    { category: 'Labor', amount: '12000' },
    { category: 'Permits', amount: '1500' }
];
export default function ConstructionBudgetTracker() {
    const [budget, setBudget] = useState('50000');
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    function updateExpense(index, field, value) {
        setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    }
    function addExpense() {
        setExpenses((prev) => [...prev, { category: '', amount: '' }]);
    }
    function removeExpense(index) {
        setExpenses((prev) => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/construction-budget-tracker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { budget, expenses } })
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
    }, [budget, expenses]);
    const { totalSpent, remaining, percentUsed, byCategory, budget: budgetNum } = data || {};
    return (
        <div className="tool-page">
            <h1>Construction Budget Tracker</h1>
            <p className="tool-description">
                Track spending against a total construction budget - enter your budget and a list of expense
                line items by category, and see running total spent, remaining budget, and percentage used
                per category. This is a simple manual tracker for planning purposes; it does not connect to
                any accounting system.
            </p>
            <div className="tool-controls">
                <label>
                    Total budget:
                    <input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '120px' }} />
                </label>
                <button type="button" onClick={addExpense}>
                    Add expense
                </button>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((e, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={e.category} onChange={(ev) => updateExpense(i, 'category', ev.target.value)} placeholder="e.g. Materials" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={e.amount} onChange={(ev) => updateExpense(i, 'amount', ev.target.value)} style={{ width: '100px' }} />
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeExpense(i)} disabled={expenses.length <= 1}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data && (
                <div className="timestamp-result">
                    <div>
                        <strong>Total spent:</strong> ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div>
                        <strong>Remaining budget:</strong> ${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div>
                        <strong>Percentage used:</strong> {percentUsed !== null ? percentUsed.toFixed(1) : '0.0'}%
                    </div>
                    {remaining < 0 && (
                        <div style={{ color: '#dc2626', fontWeight: 600 }}>Over budget by ${Math.abs(remaining).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    )}
                </div>
            )}
            {data && Object.keys(byCategory).length > 0 && (
                <div className="regex-groups-wrap" style={{ marginTop: 16 }}>
                    <table className="regex-groups-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Spent</th>
                                <th>% of budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(byCategory).map(([cat, amt]) => (
                                <tr key={cat}>
                                    <td>{cat}</td>
                                    <td>
                                        <code>${amt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</code>
                                    </td>
                                    <td>{budgetNum > 0 ? ((amt / budgetNum) * 100).toFixed(1) : '0.0'}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
