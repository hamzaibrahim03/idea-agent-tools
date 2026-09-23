import { useEffect, useState } from 'react';
export default function RestaurantProfitCalculator() {
  const [revenue, setRevenue] = useState('50000');
  const [foodCost, setFoodCost] = useState('15000');
  const [labor, setLabor] = useState('14000');
  const [rent, setRent] = useState('6000');
  const [utilities, setUtilities] = useState('2000');
  const [other, setOther] = useState('3000');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/restaurant-profit-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { revenue, foodCost, labor, rent, utilities, other } })
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
  }, [revenue, foodCost, labor, rent, utilities, other]);
  const allValid = result?.allValid ?? false;
  const expenses = result?.expenses ?? {};
  const totalExpenses = result?.totalExpenses ?? 0;
  const netProfit = result?.netProfit ?? 0;
  const profitMargin = result?.profitMargin ?? null;
  const revenueNum = result?.revenue ?? Number(revenue);
  return (
    <div className="tool-page">
      <h1>Restaurant Profit Calculator</h1>
      <p className="tool-description">
        Enter total revenue and expense categories - food cost, labor, rent, utilities, and other -
        to compute net profit, profit margin percentage, and each category's share of revenue.
        Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="rp-revenue">Total revenue ($)</label>
          <input id="rp-revenue" type="number" min={0} value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rp-food">Food cost ($)</label>
          <input id="rp-food" type="number" min={0} value={foodCost} onChange={(e) => setFoodCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rp-labor">Labor ($)</label>
          <input id="rp-labor" type="number" min={0} value={labor} onChange={(e) => setLabor(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rp-rent">Rent ($)</label>
          <input id="rp-rent" type="number" min={0} value={rent} onChange={(e) => setRent(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rp-utilities">Utilities ($)</label>
          <input id="rp-utilities" type="number" min={0} value={utilities} onChange={(e) => setUtilities(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rp-other">Other expenses ($)</label>
          <input id="rp-other" type="number" min={0} value={other} onChange={(e) => setOther(e.target.value)} />
        </div>
      </div>
      {!allValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive revenue and non-negative expense values.
        </div>
      )}
      {allValid && (
        <>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount ($)</th>
                  <th>% of revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expenses).map(([label, amount]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td><code>{amount.toFixed(2)}</code></td>
                    <td><code>{((amount / revenueNum) * 100).toFixed(1)}%</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="timestamp-result">
            <div>
              <strong>Total expenses:</strong> ${totalExpenses.toFixed(2)}
            </div>
            <div>
              <strong>Net profit:</strong> ${netProfit.toFixed(2)}
            </div>
            <div>
              <strong>Profit margin:</strong> {profitMargin.toFixed(1)}%
            </div>
          </div>
        </>
      )}
    </div>
  );
}
