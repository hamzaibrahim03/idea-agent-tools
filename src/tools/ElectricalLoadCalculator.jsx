import { useState } from 'react';
export default function ElectricalLoadCalculator() {
  const [items, setItems] = useState([
    { id: 1, name: 'Refrigerator', watts: '800', quantity: '1' },
    { id: 2, name: 'Microwave', watts: '1200', quantity: '1' },
    { id: 3, name: 'Lighting circuit', watts: '600', quantity: '1' }
  ]);
  const [voltage, setVoltage] = useState('120');
  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { id: Date.now(), name: '', watts: '', quantity: '1' }]);
  }
  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  const rows = items.map((it) => {
    const w = Number(it.watts);
    const q = Number(it.quantity);
    const valid = Number.isFinite(w) && w >= 0 && Number.isFinite(q) && q > 0;
    return { ...it, subtotal: valid ? w * q : null };
  });
  const totalWatts = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const voltageNum = Number(voltage);
  const voltageValid = Number.isFinite(voltageNum) && voltageNum > 0;
  const totalAmps = voltageValid ? totalWatts / voltageNum : null;
  return (
    <div className="tool-page">
      <h1>Electrical Load Calculator</h1>
      <p className="tool-description">
        Add electrical appliances or circuits with their wattage and quantity to sum total
        connected load, then compute the required amperage at a given voltage using the standard
        formula: amps = watts / volts. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Licensed professional required:</strong> This is a basic connected-load estimate.
        Real electrical service and circuit sizing must account for demand factors, continuous
        loads, and code requirements. A licensed electrician or engineer must verify anything used
        for actual permits or installation (e.g. NEC in the US).
      </div>
      <div className="tool-controls">
        <label>
          Voltage (V):
          <input type="number" min={0} value={voltage} onChange={(e) => setVoltage(e.target.value)} style={{ width: '90px' }} />
        </label>
        <button type="button" onClick={addItem}>
          Add appliance/circuit
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Watts</th>
              <th>Quantity</th>
              <th>Subtotal (W)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <input type="text" value={r.name} onChange={(e) => updateItem(r.id, 'name', e.target.value)} placeholder="e.g. Water heater" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={r.watts} onChange={(e) => updateItem(r.id, 'watts', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <input type="number" min={1} value={r.quantity} onChange={(e) => updateItem(r.id, 'quantity', e.target.value)} style={{ width: '70px' }} />
                </td>
                <td>
                  <code>{r.subtotal !== null ? r.subtotal.toFixed(0) : '-'}</code>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeItem(r.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!voltageValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive voltage.
        </div>
      )}
      <div className="timestamp-result">
        <div>
          <strong>Total connected load:</strong> {totalWatts.toFixed(0)} W
        </div>
        {totalAmps !== null && (
          <div>
            <strong>Required amperage:</strong> {totalAmps.toFixed(2)} A
          </div>
        )}
      </div>
    </div>
  );
}
