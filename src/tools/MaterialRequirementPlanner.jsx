import { useState } from 'react';
const DEFAULT_COMPONENTS = [
  { name: 'Bolt (M6)', qtyPerUnit: '4' },
  { name: 'Bracket', qtyPerUnit: '2' },
  { name: 'Housing', qtyPerUnit: '1' }
];
export default function MaterialRequirementPlanner() {
  const [targetQty, setTargetQty] = useState('500');
  const [components, setComponents] = useState(DEFAULT_COMPONENTS);
  function updateComponent(index, field, value) {
    setComponents((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }
  function addComponent() {
    setComponents((prev) => [...prev, { name: '', qtyPerUnit: '' }]);
  }
  function removeComponent(index) {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }
  const targetNum = Number(targetQty);
  const targetValid = Number.isFinite(targetNum) && targetNum > 0;
  const rows = components.map((c) => {
    const qty = Number(c.qtyPerUnit);
    const validRow = Number.isFinite(qty) && qty >= 0;
    const totalNeeded = validRow && targetValid ? qty * targetNum : null;
    return { ...c, qty, validRow, totalNeeded };
  });
  return (
    <div className="tool-page">
      <h1>Material Requirement Planner</h1>
      <p className="tool-description">
        Build a simple bill of materials - list each component and how many are needed per finished
        unit - then enter your target production quantity to get the total quantity required for each
        component. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Target production quantity:
          <input type="number" min={0} value={targetQty} onChange={(e) => setTargetQty(e.target.value)} style={{ width: '110px' }} />
        </label>
        <button type="button" onClick={addComponent}>
          Add component
        </button>
      </div>
      {!targetValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive target production quantity.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Qty needed per unit</th>
              <th>Total qty needed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => updateComponent(i, 'name', e.target.value)}
                    placeholder="e.g. Bolt (M6)"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.qtyPerUnit}
                    onChange={(e) => updateComponent(i, 'qtyPerUnit', e.target.value)}
                    style={{ width: '90px' }}
                  />
                </td>
                <td>
                  <code>{r.totalNeeded !== null ? r.totalNeeded.toLocaleString() : '-'}</code>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeComponent(i)} disabled={components.length <= 1}>
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
