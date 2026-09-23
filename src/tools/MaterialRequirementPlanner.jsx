import { useEffect, useState } from 'react';
const DEFAULT_COMPONENTS = [
  { name: 'Bolt (M6)', qtyPerUnit: '4' },
  { name: 'Bracket', qtyPerUnit: '2' },
  { name: 'Housing', qtyPerUnit: '1' }
];
export default function MaterialRequirementPlanner() {
  const [targetQty, setTargetQty] = useState('500');
  const [components, setComponents] = useState(DEFAULT_COMPONENTS);
  const [targetValid, setTargetValid] = useState(true);
  const [rows, setRows] = useState([]);
  const [fetchError, setFetchError] = useState('');
  function updateComponent(index, field, value) {
    setComponents((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }
  function addComponent() {
    setComponents((prev) => [...prev, { name: '', qtyPerUnit: '' }]);
  }
  function removeComponent(index) {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/material-requirement-planner', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { targetQty, components } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setTargetValid(data.targetValid);
            setRows(data.rows || []);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [targetQty, components]);
  return (
    <div className="tool-page">
      <h1>Material Requirement Planner</h1>
      <p className="tool-description">
        Build a simple bill of materials - list each component and how many are needed per finished
        unit - then enter your target production quantity to get the total quantity required for each
        component.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
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
            {components.map((c, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateComponent(i, 'name', e.target.value)}
                    placeholder="e.g. Bolt (M6)"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={c.qtyPerUnit}
                    onChange={(e) => updateComponent(i, 'qtyPerUnit', e.target.value)}
                    style={{ width: '90px' }}
                  />
                </td>
                <td>
                  <code>{rows[i]?.totalNeeded !== null && rows[i]?.totalNeeded !== undefined ? rows[i].totalNeeded.toLocaleString() : '-'}</code>
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
