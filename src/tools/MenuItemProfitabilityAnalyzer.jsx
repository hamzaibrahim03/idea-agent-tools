import { useEffect, useState } from 'react';
export default function MenuItemProfitabilityAnalyzer() {
  const [items, setItems] = useState([
    { id: 1, name: 'Burger', cost: '3.50', price: '12.00', sold: '400' },
    { id: 2, name: 'Salad', cost: '2.00', price: '9.00', sold: '150' },
    { id: 3, name: 'Steak', cost: '9.00', price: '24.00', sold: '80' }
  ]);
  const [sortBy, setSortBy] = useState('totalProfit');
  const [rows, setRows] = useState([]);
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  const [fetchError, setFetchError] = useState('');
  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { id: Date.now(), name: '', cost: '', price: '', sold: '' }]);
  }
  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/menu-item-profitability-analyzer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { items, sortBy } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setRows(data.rows || []);
            setGrandTotalProfit(data.grandTotalProfit || 0);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [items, sortBy]);
  return (
    <div className="tool-page">
      <h1>Menu Item Profitability Analyzer</h1>
      <p className="tool-description">
        Add menu items with their cost, price, and number sold in a period to compute profit per
        item and total profit contribution - a menu engineering style analysis sorted to show your
        most and least profitable items.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="totalProfit">Total profit contribution</option>
            <option value="profitPerItem">Profit per item</option>
            <option value="totalRevenue">Total revenue</option>
          </select>
        </label>
        <button type="button" onClick={addItem}>
          Add menu item
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost ($)</th>
              <th>Price ($)</th>
              <th>Sold</th>
              <th>Profit/item ($)</th>
              <th>Total profit ($)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <input type="text" value={r.name} onChange={(e) => updateItem(r.id, 'name', e.target.value)} placeholder="e.g. Pizza" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.cost} onChange={(e) => updateItem(r.id, 'cost', e.target.value)} style={{ width: '80px' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.price} onChange={(e) => updateItem(r.id, 'price', e.target.value)} style={{ width: '80px' }} />
                </td>
                <td>
                  <input type="number" min={0} value={r.sold} onChange={(e) => updateItem(r.id, 'sold', e.target.value)} style={{ width: '70px' }} />
                </td>
                <td>
                  <code>{r.valid ? r.profitPerItem.toFixed(2) : '-'}</code>
                </td>
                <td>
                  <code>{r.valid ? r.totalProfit.toFixed(2) : '-'}</code>
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
        <strong>Total profit contribution (all items):</strong> ${grandTotalProfit.toFixed(2)}
      </div>
    </div>
  );
}
