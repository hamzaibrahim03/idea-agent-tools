import { useEffect, useState } from 'react';
export default function ProfitLossCalculator() {
  const [revenue, setRevenue] = useState('10000');
  const [cogs, setCogs] = useState('4000');
  const [expenses, setExpenses] = useState([
    { label: 'Rent', amount: '1200' },
    { label: 'Salaries', amount: '2500' },
    { label: 'Marketing', amount: '500' }
  ]);
  const [result, setResult] = useState({ valid: false, grossProfit: 0, totalExpenses: 0, netProfit: 0, netMargin: 0, grossMargin: 0 });
  const [error, setError] = useState('');
  function updateExpense(index, field, value) {
    setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function addExpense() {
    setExpenses((prev) => [...prev, { label: '', amount: '' }]);
  }
  function removeExpense(index) {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/profit-loss-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { revenue, cogs, expenses } })
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
  }, [revenue, cogs, expenses]);
  const { valid, grossProfit, totalExpenses, netProfit, netMargin, grossMargin } = result;
  return (
    <div className="tool-page">
      <h1>Profit &amp; Loss Calculator</h1>
      <p className="tool-description">
        Enter revenue, cost of goods sold, and a list of operating expense line items to compute
        gross profit, total expenses, net profit, and profit margin. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pl-revenue">Total revenue</label>
          <input id="pl-revenue" type="number" min={0} value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pl-cogs">Cost of goods sold (COGS)</label>
          <input id="pl-cogs" type="number" min={0} value={cogs} onChange={(e) => setCogs(e.target.value)} />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addExpense}>
          Add expense line item
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Expense</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={e.label}
                    onChange={(ev) => updateExpense(i, 'label', ev.target.value)}
                    placeholder="e.g. Utilities"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={e.amount}
                    onChange={(ev) => updateExpense(i, 'amount', ev.target.value)}
                    style={{ width: '100px' }}
                  />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeExpense(i)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative revenue and cost of goods sold.
        </div>
      )}
      {!error && valid && (
        <div className="timestamp-result">
          <div>
            <strong>Gross profit:</strong> <code>{grossProfit.toFixed(2)}</code> ({grossMargin.toFixed(2)}% gross margin)
          </div>
          <div>
            <strong>Total expenses (COGS + operating):</strong> <code>{totalExpenses.toFixed(2)}</code>
          </div>
          <div>
            <strong>Net profit:</strong> <code>{netProfit.toFixed(2)}</code>
          </div>
          <div>
            <strong>Net profit margin:</strong> <code>{netMargin.toFixed(2)}%</code>
          </div>
        </div>
      )}
    </div>
  );
}
