import { useEffect, useState } from 'react';
const DEFAULT_EXPENSES = [
    { category: 'Seed', description: 'Corn seed - 50 bags', amount: '3200', date: new Date().toISOString().slice(0, 10) },
    { category: 'Fuel', description: 'Diesel for planting', amount: '850', date: new Date().toISOString().slice(0, 10) }
];
export default function FarmExpenseTracker() {
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
    const [total, setTotal] = useState(0);
    const [byCategory, setByCategory] = useState({});
    const [fetchError, setFetchError] = useState('');
    function updateExpense(index, field, value) {
        setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    }
    function addExpense() {
        setExpenses((prev) => [...prev, { category: '', description: '', amount: '', date: new Date().toISOString().slice(0, 10) }]);
    }
    function removeExpense(index) {
        setExpenses((prev) => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/farm-expense-tracker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { expenses } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setTotal(data.total || 0);
                        setByCategory(data.byCategory || {});
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [expenses]);
    return (
        <div className="tool-page">
            <h1>Farm Expense Tracker</h1>
            <p className="tool-description">
                A simple client-side farm expense tracker - add expenses by category, description, amount, and
                date, and see the running total and a breakdown by category. This tool keeps data only in this
                browser tab for your current session; nothing is saved to a server or persisted after you
                leave the page. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <button type="button" onClick={addExpense}>
                    Add expense
                </button>
            </div>
            <div className="regex-groups-wrap">
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((e, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={e.category} onChange={(ev) => updateExpense(i, 'category', ev.target.value)} placeholder="e.g. Seed" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="text" value={e.description} onChange={(ev) => updateExpense(i, 'description', ev.target.value)} placeholder="Description" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={e.amount} onChange={(ev) => updateExpense(i, 'amount', ev.target.value)} style={{ width: '100px' }} />
                                </td>
                                <td>
                                    <input type="date" value={e.date} onChange={(ev) => updateExpense(i, 'date', ev.target.value)} />
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
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="timestamp-result">
                <div>
                    <strong>Total expenses:</strong> ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
            </div>
            {Object.keys(byCategory).length > 0 && (
                <div className="regex-groups-wrap" style={{ marginTop: 16 }}>
                    <table className="regex-groups-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Total spent</th>
                                <th>% of total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(byCategory).map(([cat, amt]) => (
                                <tr key={cat}>
                                    <td>{cat}</td>
                                    <td>
                                        <code>${amt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</code>
                                    </td>
                                    <td>{total > 0 ? ((amt / total) * 100).toFixed(1) : '0.0'}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
