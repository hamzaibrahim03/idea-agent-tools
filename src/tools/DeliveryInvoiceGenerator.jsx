import { useState } from 'react';
const DEFAULT_ITEMS = [{ description: 'Pallet shipment', weight: '500', rate: '0.35' }];
export default function DeliveryInvoiceGenerator() {
  const [shipperName, setShipperName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-1001');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState(DEFAULT_ITEMS);
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: '', weight: '', rate: '' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  const rows = items.map((it) => {
    const weight = Number(it.weight);
    const rate = Number(it.rate);
    const validRow = Number.isFinite(weight) && weight >= 0 && Number.isFinite(rate) && rate >= 0;
    const lineTotal = validRow ? weight * rate : 0;
    return { ...it, weight, rate, validRow, lineTotal };
  });
  const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);
  return (
    <div className="tool-page">
      <h1>Delivery Invoice Generator</h1>
      <p className="tool-description">
        Enter shipper and receiver details and a list of shipment line items (description, weight,
        rate per unit weight), and get a clean printable delivery/freight invoice with computed
        totals. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addItem}>
          Add line item
        </button>
        <button type="button" onClick={() => window.print()}>
          Print invoice
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="div-shipper">Shipper name / address</label>
          <textarea id="div-shipper" value={shipperName} onChange={(e) => setShipperName(e.target.value)} style={{ minHeight: 70 }} />
        </div>
        <div className="tool-panel">
          <label htmlFor="div-receiver">Receiver name / address</label>
          <textarea id="div-receiver" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} style={{ minHeight: 70 }} />
        </div>
        <div className="tool-panel">
          <label htmlFor="div-number">Invoice number</label>
          <input id="div-number" type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="div-date">Invoice date</label>
          <input id="div-date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        </div>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Weight</th>
              <th>Rate</th>
              <th>Line total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={r.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="e.g. Pallet shipment" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={r.weight} onChange={(e) => updateItem(i, 'weight', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.rate} onChange={(e) => updateItem(i, 'rate', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <code>${r.lineTotal.toFixed(2)}</code>
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
      <div className="timestamp-result">
        <div>
          <strong>Invoice total:</strong> ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
