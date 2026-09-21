import { useState } from 'react';
const DEFAULT_COSTS = [
  { label: 'Seed', amount: '3000' },
  { label: 'Fertilizer', amount: '4500' },
  { label: 'Labor', amount: '6000' }
];
export default function CropProfitCalculator() {
  const [yieldPerAcre, setYieldPerAcre] = useState('180');
  const [pricePerUnit, setPricePerUnit] = useState('4.20');
  const [totalAcres, setTotalAcres] = useState('100');
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  function updateCost(index, field, value) {
    setCosts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }
  function addCost() {
    setCosts((prev) => [...prev, { label: '', amount: '' }]);
  }
  function removeCost(index) {
    setCosts((prev) => prev.filter((_, i) => i !== index));
  }
  const yieldNum = Number(yieldPerAcre);
  const priceNum = Number(pricePerUnit);
  const acresNum = Number(totalAcres);
  const valid =
    Number.isFinite(yieldNum) && yieldNum > 0 &&
    Number.isFinite(priceNum) && priceNum >= 0 &&
    Number.isFinite(acresNum) && acresNum > 0;
  const totalCost = costs.reduce((sum, c) => {
    const a = Number(c.amount);
    return sum + (Number.isFinite(a) && a >= 0 ? a : 0);
  }, 0);
  const totalYield = valid ? yieldNum * acresNum : null;
  const totalRevenue = valid ? totalYield * priceNum : null;
  const netProfit = valid ? totalRevenue - totalCost : null;
  return (
    <div className="tool-page">
      <h1>Crop Profit Calculator</h1>
      <p className="tool-description">
        Enter expected yield per acre, price per unit, total acres, and your cost line items (seed,
        fertilizer, labor, etc.) to compute total revenue, total cost, and net profit. Runs entirely
        in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cpc2-yield">Expected yield per acre</label>
          <input id="cpc2-yield" type="number" min={0} step="0.01" value={yieldPerAcre} onChange={(e) => setYieldPerAcre(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="cpc2-price">Price per unit</label>
          <input id="cpc2-price" type="number" min={0} step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="cpc2-acres">Total acres</label>
          <input id="cpc2-acres" type="number" min={0} step="0.01" value={totalAcres} onChange={(e) => setTotalAcres(e.target.value)} />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addCost}>
          Add cost line item
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Cost item</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {costs.map((c, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={c.label} onChange={(e) => updateCost(i, 'label', e.target.value)} placeholder="e.g. Seed" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={c.amount} onChange={(e) => updateCost(i, 'amount', e.target.value)} style={{ width: '100px' }} />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeCost(i)} disabled={costs.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive yield per acre, non-negative price, and positive total acres.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Total yield:</strong> {totalYield.toLocaleString(undefined, { maximumFractionDigits: 1 })} units
          </div>
          <div>
            <strong>Total revenue:</strong> ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Total cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Net profit:</strong> ${netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          {netProfit < 0 && <div style={{ color: '#dc2626', fontWeight: 600 }}>Projected loss</div>}
        </div>
      )}
    </div>
  );
}
