import { useEffect, useState } from 'react';
const DEFAULT_ITEMS = [{ description: 'Pallet shipment', weight: '500', rate: '0.35' }];
export default function DeliveryInvoiceGenerator() {
    const [shipperName, setShipperName] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('INV-1001');
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState(DEFAULT_ITEMS);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');
    function updateItem(index, field, value) {
        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
    }
    function addItem() {
        setItems((prev) => [...prev, { description: '', weight: '', rate: '' }]);
    }
    function removeItem(index) {
        setItems((prev) => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/delivery-invoice-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { items } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else {
                        setRows(d.rows || []);
                        setTotal(d.total || 0);
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [items]);
    return (
        <div className="tool-page">
            <h1>Delivery Invoice Generator</h1>
            <p className="tool-description">
                Enter shipper and receiver details and a list of shipment line items (description, weight,
                rate per unit weight), and get a clean printable delivery/freight invoice with computed
                totals.
            </p>
            <div className="tool-controls">
                <button type="button" onClick={addItem}>
                    Add line item
                </button>
                <button type="button" onClick={() => window.print()}>
                    Print invoice
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
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
                        {items.map((it, i) => (
                            <tr key={i}>
                                <td>
                                    <input type="text" value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="e.g. Pallet shipment" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} value={it.weight} onChange={(e) => updateItem(i, 'weight', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} step="0.01" value={it.rate} onChange={(e) => updateItem(i, 'rate', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <code>${(rows[i]?.lineTotal ?? 0).toFixed(2)}</code>
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
