import { useState } from 'react';
export default function WindowDoorQuantityCalculator() {
  const [items, setItems] = useState([
    { id: 1, type: 'Window', width: '36', height: '48', quantity: '4' },
    { id: 2, type: 'Door', width: '32', height: '80', quantity: '2' }
  ]);
  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { id: Date.now(), type: 'Window', width: '', height: '', quantity: '1' }]);
  }
  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  const rows = items.map((it) => {
    const w = Number(it.width);
    const h = Number(it.height);
    const q = Number(it.quantity);
    const valid = w > 0 && h > 0 && Number.isFinite(q) && q > 0;
    if (!valid) return { ...it, valid: false };
    const areaEach = (w * h) / 144;
    const perimeterEach = (2 * (w + h)) / 12;
    return {
      ...it,
      valid: true,
      totalArea: areaEach * q,
      totalPerimeter: perimeterEach * q
    };
  });
  const totalArea = rows.reduce((sum, r) => sum + (r.valid ? r.totalArea : 0), 0);
  const totalPerimeter = rows.reduce((sum, r) => sum + (r.valid ? r.totalPerimeter : 0), 0);
  const totalCount = rows.reduce((sum, r) => (r.valid ? sum + Number(r.quantity) : sum), 0);
  return (
    <div className="tool-page">
      <h1>Window &amp; Door Quantity Calculator</h1>
      <p className="tool-description">
        Add window and door items with their type, width, height, and quantity to get the total
        opening area and total rough-opening perimeter - useful for framing and trim estimates.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addItem}>
          Add item
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Width (in)</th>
              <th>Height (in)</th>
              <th>Qty</th>
              <th>Area (sq ft)</th>
              <th>Perimeter (ft)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <select value={r.type} onChange={(e) => updateItem(r.id, 'type', e.target.value)}>
                    <option value="Window">Window</option>
                    <option value="Door">Door</option>
                  </select>
                </td>
                <td>
                  <input type="number" min={0} value={r.width} onChange={(e) => updateItem(r.id, 'width', e.target.value)} style={{ width: '80px' }} />
                </td>
                <td>
                  <input type="number" min={0} value={r.height} onChange={(e) => updateItem(r.id, 'height', e.target.value)} style={{ width: '80px' }} />
                </td>
                <td>
                  <input type="number" min={1} value={r.quantity} onChange={(e) => updateItem(r.id, 'quantity', e.target.value)} style={{ width: '60px' }} />
                </td>
                <td>
                  <code>{r.valid ? r.totalArea.toFixed(2) : '-'}</code>
                </td>
                <td>
                  <code>{r.valid ? r.totalPerimeter.toFixed(2) : '-'}</code>
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
      <div className="timestamp-result">
        <div>
          <strong>Total openings:</strong> {totalCount}
        </div>
        <div>
          <strong>Total opening area:</strong> {totalArea.toFixed(2)} sq ft
        </div>
        <div>
          <strong>Total rough-opening perimeter:</strong> {totalPerimeter.toFixed(2)} ft
        </div>
      </div>
    </div>
  );
}
