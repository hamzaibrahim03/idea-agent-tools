import { useState } from 'react';
const DEFAULT_EXPENSES = [
  { category: 'Materials', amount: '15000' },
  { category: 'Labor', amount: '12000' },
  { category: 'Permits', amount: '1500' }
];
export default function ConstructionBudgetTracker() {
  const [budget, setBudget] = useState('50000');
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  function updateExpense(index, field, value) {
    setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function addExpense() {
    setExpenses((prev) => [...prev, { category: '', amount: '' }]);
  }
  function removeExpense(index) {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  }
  const budgetNum = Number(budget);
  const budgetValid = Number.isFinite(budgetNum) && budgetNum >= 0;
  const rows = expenses.map((e) => {
    const amt = Number(e.amount);
    const validRow = Number.isFinite(amt) && amt >= 0;
    return { ...e, amt: validRow ? amt : 0, validRow };
  });
  const totalSpent = rows.reduce((sum, r) => sum + r.amt, 0);
  const remaining = budgetValid ? budgetNum - totalSpent : null;
  const percentUsed = budgetValid && budgetNum > 0 ? (totalSpent / budgetNum) * 100 : null;
  const byCategory = {};
  rows.forEach((r) => {
    const cat = r.category.trim() || '(uncategorized)';
    byCategory[cat] = (byCategory[cat] || 0) + r.amt;
  });
  return (
    <div className="tool-page">
      <h1>Construction Budget Tracker</h1>
      <p className="tool-description">
        Track spending against a total construction budget - enter your budget and a list of expense
        line items by category, and see running total spent, remaining budget, and percentage used
        per category. This is a simple manual tracker for planning purposes; it does not connect to
        any accounting system. Runs entirely in your browser.
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
      {!budgetValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative total budget.
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
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={r.category}
                    onChange={(e) => updateExpense(i, 'category', e.target.value)}
                    placeholder="e.g. Materials"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.amount}
                    onChange={(e) => updateExpense(i, 'amount', e.target.value)}
                    style={{ width: '100px' }}
                  />
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
      {budgetValid && (
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
      {budgetValid && Object.keys(byCategory).length > 0 && (
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
