import { useState } from 'react';
const DEFAULT_TRADES = [
  { trade: 'Mason', rate: '35', days: '10' },
  { trade: 'Carpenter', rate: '32', days: '8' },
  { trade: 'Electrician', rate: '40', days: '5' },
  { trade: 'Plumber', rate: '38', days: '5' },
  { trade: 'Helper', rate: '20', days: '15' }
];
export default function LaborCostCalculator() {
  const [rows, setRows] = useState(DEFAULT_TRADES.map((t) => ({ ...t, workers: '1' })));
  function updateRow(index, field, value) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { trade: '', rate: '', days: '', workers: '1' }]);
  }
  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  const computed = rows.map((r) => {
    const rate = Number(r.rate);
    const days = Number(r.days);
    const workers = Number(r.workers);
    const validRow = Number.isFinite(rate) && rate >= 0 && Number.isFinite(days) && days >= 0 && Number.isFinite(workers) && workers >= 0;
    const cost = validRow ? rate * days * workers : 0;
    return { ...r, cost, validRow };
  });
  const grandTotal = computed.reduce((sum, r) => sum + r.cost, 0);
  return (
    <div className="tool-page">
      <h1>Construction Labor Cost Calculator</h1>
      <p className="tool-description">
        Estimate total labor cost for a construction project by trade - enter the number of workers,
        daily rate, and number of days for each trade (mason, carpenter, electrician, plumber, helper,
        or your own), and get an itemized cost plus grand total. Rates and durations are whatever you
        enter; this tool does not look up local wage data. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addRow}>
          Add trade
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Trade</th>
              <th>Workers</th>
              <th>Daily rate</th>
              <th>Days</th>
              <th>Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {computed.map((r, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={r.trade}
                    onChange={(e) => updateRow(i, 'trade', e.target.value)}
                    placeholder="e.g. Mason"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={r.workers}
                    onChange={(e) => updateRow(i, 'workers', e.target.value)}
                    style={{ width: '70px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.rate}
                    onChange={(e) => updateRow(i, 'rate', e.target.value)}
                    style={{ width: '90px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.days}
                    onChange={(e) => updateRow(i, 'days', e.target.value)}
                    style={{ width: '70px' }}
                  />
                </td>
                <td>
                  <code>{r.validRow ? r.cost.toFixed(2) : '—'}</code>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeRow(i)} disabled={rows.length <= 1}>
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
          <strong>Total labor cost:</strong> <code>{grandTotal.toFixed(2)}</code>
        </div>
      </div>
    </div>
  );
}
