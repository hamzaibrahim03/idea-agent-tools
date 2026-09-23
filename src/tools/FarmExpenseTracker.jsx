import { useState } from 'react';
const DEFAULT_EXPENSES = [
  { category: 'Seed', description: 'Corn seed - 50 bags', amount: '3200', date: new Date().toISOString().slice(0, 10) },
  { category: 'Fuel', description: 'Diesel for planting', amount: '850', date: new Date().toISOString().slice(0, 10) }
];
export default function FarmExpenseTracker() {
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  function updateExpense(index, field, value) {
    setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function addExpense() {
    setExpenses((prev) => [...prev, { category: '', description: '', amount: '', date: new Date().toISOString().slice(0, 10) }]);
  }
  function removeExpense(index) {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  }
  const rows = expenses.map((e) => {
    const amt = Number(e.amount);
    return { ...e, amt: Number.isFinite(amt) && amt >= 0 ? amt : 0 };
  });
  const total = rows.reduce((sum, r) => sum + r.amt, 0);
  const byCategory = {};
  rows.forEach((r) => {
    const cat = r.category.trim() || '(uncategorized)';
    byCategory[cat] = (byCategory[cat] || 0) + r.amt;
  });
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
