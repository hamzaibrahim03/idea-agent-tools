import { useEffect, useState } from 'react';
export default function PortionCostCalculator() {
  const [bulkCost, setBulkCost] = useState('45.00');
  const [bulkQuantity, setBulkQuantity] = useState('25');
  const [bulkUnit, setBulkUnit] = useState('lb');
  const [portionSize, setPortionSize] = useState('6');
  const [portionUnit, setPortionUnit] = useState('oz');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/portion-cost-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { bulkCost, bulkQuantity, bulkUnit, portionSize, portionUnit } })
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
  }, [bulkCost, bulkQuantity, bulkUnit, portionSize, portionUnit]);
  const valid = result?.valid ?? false;
  const costPerPortion = result?.costPerPortion ?? null;
  const portionsAvailable = result?.portionsAvailable ?? null;
  return (
    <div className="tool-page">
      <h1>Portion Cost Calculator</h1>
      <p className="tool-description">
        Given a bulk ingredient's total cost and total quantity purchased, plus the portion size
        used per serving, compute the cost per portion and how many portions the bulk quantity
        yields. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pc-cost">Bulk ingredient total cost ($)</label>
          <input id="pc-cost" type="number" min={0} step="0.01" value={bulkCost} onChange={(e) => setBulkCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pc-bulk-qty">Bulk quantity purchased</label>
          <input id="pc-bulk-qty" type="number" min={0} step="0.01" value={bulkQuantity} onChange={(e) => setBulkQuantity(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pc-bulk-unit">Bulk unit</label>
          <select id="pc-bulk-unit" value={bulkUnit} onChange={(e) => setBulkUnit(e.target.value)}>
            <option value="oz">Ounces (oz)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="pc-portion-size">Portion size per serving</label>
          <input id="pc-portion-size" type="number" min={0} step="0.01" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pc-portion-unit">Portion unit</label>
          <select id="pc-portion-unit" value={portionUnit} onChange={(e) => setPortionUnit(e.target.value)}>
            <option value="oz">Ounces (oz)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative cost and positive bulk quantity and portion
          size.
        </div>
      )}
      {!error && valid && (
        <div className="timestamp-result">
          <div>
            <strong>Cost per portion:</strong> ${costPerPortion.toFixed(3)}
          </div>
          <div>
            <strong>Portions available from bulk quantity:</strong> {portionsAvailable.toFixed(1)}
          </div>
        </div>
      )}
    </div>
  );
}
