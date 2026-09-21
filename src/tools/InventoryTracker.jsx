import { useState } from 'react';
const DEFAULT_ITEMS = [
  { sku: 'SKU-1001', name: 'Steel Bolts (Box)', quantity: '240', location: 'Aisle 3, Bin A' },
  { sku: 'SKU-1002', name: 'Shipping Pallets', quantity: '58', location: 'Dock 2' }
];
export default function InventoryTracker() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [search, setSearch] = useState('');
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { sku: '', name: '', quantity: '', location: '' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  const filtered = items.filter((it) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      it.sku.toLowerCase().includes(q) ||
      it.name.toLowerCase().includes(q) ||
      it.location.toLowerCase().includes(q)
    );
  });
  const totalQuantity = items.reduce((sum, it) => {
    const q = Number(it.quantity);
    return sum + (Number.isFinite(q) && q >= 0 ? q : 0);
  }, 0);
  return (
    <div className="tool-page">
      <h1>Logistics Inventory Tracker</h1>
      <p className="tool-description">
        A simple client-side inventory tracker - add items by SKU, name, quantity, and location, then
        search and filter the list. This tool keeps data only in this browser tab for your current
        session; nothing is saved to a server or persisted after you leave the page. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by SKU, name, or location" style={{ minWidth: '220px' }} />
        <button type="button" onClick={addItem}>
          Add item
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const i = items.indexOf(it);
              return (
                <tr key={i}>
                  <td>
                    <input type="text" value={it.sku} onChange={(e) => updateItem(i, 'sku', e.target.value)} placeholder="SKU-1001" style={{ width: '100%' }} />
                  </td>
                  <td>
                    <input type="text" value={it.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Item name" style={{ width: '100%' }} />
                  </td>
                  <td>
                    <input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} style={{ width: '90px' }} />
                  </td>
                  <td>
                    <input type="text" value={it.location} onChange={(e) => updateItem(i, 'location', e.target.value)} placeholder="Aisle 1, Bin A" style={{ width: '100%' }} />
                  </td>
                  <td>
                    <button type="button" className="uuid-copy-btn" onClick={() => removeItem(i)} disabled={items.length <= 1}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="tool-error">No items match your search.</div>
      )}
      <div className="timestamp-result">
        <div>
          <strong>Total items tracked:</strong> {items.length}
        </div>
        <div>
          <strong>Total quantity:</strong> {totalQuantity.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
