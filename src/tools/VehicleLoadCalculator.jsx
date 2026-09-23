import { useEffect, useState } from 'react';
const DEFAULT_ITEMS = [
  { name: 'Pallet A', weight: '800' },
  { name: 'Pallet B', weight: '650' }
];
export default function VehicleLoadCalculator() {
  const [maxCapacity, setMaxCapacity] = useState('5000');
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [result, setResult] = useState({ capacityValid: false, capacityNum: 0, totalWeight: 0, remaining: null, overCapacity: false });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/vehicle-load-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { maxCapacity, items } })
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
  }, [maxCapacity, items]);
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { name: '', weight: '' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  const { capacityValid, capacityNum, totalWeight, remaining, overCapacity } = result;
  return (
    <div className="tool-page">
      <h1>Vehicle Load Calculator</h1>
      <p className="tool-description">
        Enter your vehicle's maximum payload capacity and a list of cargo items with their weights.
        The tool sums total cargo weight, shows remaining capacity, and flags if you're over the
        limit. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Max payload capacity:
          <input type="number" min={0} value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} style={{ width: '120px' }} />
        </label>
        <button type="button" onClick={addItem}>
          Add cargo item
        </button>
      </div>
      {!capacityValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive max payload capacity.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Cargo item</th>
              <th>Weight</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={it.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="e.g. Pallet A" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={it.weight} onChange={(e) => updateItem(i, 'weight', e.target.value)} style={{ width: '100px' }} />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeItem(i)} disabled={items.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {capacityValid && (
        <div className="timestamp-result">
          <div>
            <strong>Total cargo weight:</strong> {totalWeight.toLocaleString()}
          </div>
          <div>
            <strong>Max capacity:</strong> {capacityNum.toLocaleString()}
          </div>
          <div>
            <strong>Remaining capacity:</strong> {remaining.toLocaleString()}
          </div>
          {overCapacity && (
            <div style={{ color: '#dc2626', fontWeight: 600 }}>
              Over capacity by {Math.abs(remaining).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
