import { useState } from 'react';
export default function StartupCostCalculator() {
  const [oneTime, setOneTime] = useState([
    { label: 'Business registration & licenses', amount: '500' },
    { label: 'Equipment', amount: '5000' },
    { label: 'Website & branding', amount: '1500' }
  ]);
  const [recurring, setRecurring] = useState([
    { label: 'Rent', amount: '1200' },
    { label: 'Software subscriptions', amount: '150' },
    { label: 'Insurance', amount: '100' }
  ]);
  function updateRow(setter, index, field, value) {
    setter((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }
  function addRow(setter) {
    setter((prev) => [...prev, { label: '', amount: '' }]);
  }
  function removeRow(setter, index) {
    setter((prev) => prev.filter((_, i) => i !== index));
  }
  const oneTimeTotal = oneTime.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const monthlyBurn = recurring.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalInitialInvestment = oneTimeTotal + monthlyBurn;
  function renderTable(rows, setter, title) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <div className="tool-controls">
          <strong>{title}</strong>
          <button type="button" onClick={() => addRow(setter)}>
            Add line item
          </button>
        </div>
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <input type="text" value={r.label} onChange={(e) => updateRow(setter, i, 'label', e.target.value)} style={{ width: '100%' }} />
                  </td>
                  <td>
                    <input type="number" min={0} value={r.amount} onChange={(e) => updateRow(setter, i, 'amount', e.target.value)} style={{ width: '100px' }} />
                  </td>
                  <td>
                    <button type="button" className="uuid-copy-btn" onClick={() => removeRow(setter, i)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="tool-page">
      <h1>Startup Cost Calculator</h1>
      <p className="tool-description">
        List one-time startup expenses and recurring monthly expenses separately to see your total
        initial investment needed (one-time costs plus a first month of running costs) and your
        ongoing monthly burn rate. Runs entirely in your browser.
      </p>
      {renderTable(oneTime, setOneTime, 'One-time startup expenses')}
      {renderTable(recurring, setRecurring, 'Recurring monthly expenses')}
      <div className="timestamp-result">
        <div>
          <strong>Total one-time costs:</strong> <code>{oneTimeTotal.toFixed(2)}</code>
        </div>
        <div>
          <strong>Monthly burn rate:</strong> <code>{monthlyBurn.toFixed(2)}</code>
        </div>
        <div>
          <strong>Total initial investment needed (one-time + first month):</strong> <code>{totalInitialInvestment.toFixed(2)}</code>
        </div>
      </div>
    </div>
  );
}
