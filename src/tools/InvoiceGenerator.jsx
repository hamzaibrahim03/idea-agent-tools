import { useEffect, useState } from 'react';
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
export default function InvoiceGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [businessInfo, setBusinessInfo] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientInfo, setClientInfo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(todayIso());
  const [taxRate, setTaxRate] = useState('0');
  const [items, setItems] = useState([{ description: '', qty: '1', rate: '0' }]);
  const [rows, setRows] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [fetchError, setFetchError] = useState('');
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: '', qty: '1', rate: '0' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/invoice-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { items, taxRate } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setFetchError(data.error);
          } else {
            setRows(data.rows || []);
            setSubtotal(data.subtotal || 0);
            setTaxAmount(data.taxAmount || 0);
            setTotal(data.total || 0);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [items, taxRate]);
  const taxRateNum = Number(taxRate) || 0;
  function handlePrint() {
    window.print();
  }
  return (
    <div className="tool-page">
      <h1>Invoice Generator</h1>
      <p className="tool-description">
        Fill in your business and client details, add line items, and set a tax rate to generate a
        clean, printable invoice with subtotal, tax, and total computed automatically.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="inv-biz-name">Your business name</label>
          <input id="inv-biz-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          <label htmlFor="inv-biz-info">Your business address / contact</label>
          <textarea id="inv-biz-info" value={businessInfo} onChange={(e) => setBusinessInfo(e.target.value)} style={{ minHeight: '70px' }} />
        </div>
        <div className="tool-panel">
          <label htmlFor="inv-client-name">Client name</label>
          <input id="inv-client-name" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <label htmlFor="inv-client-info">Client address / contact</label>
          <textarea id="inv-client-info" value={clientInfo} onChange={(e) => setClientInfo(e.target.value)} style={{ minHeight: '70px' }} />
        </div>
      </div>
      <div className="tool-controls">
        <label>
          Invoice #:
          <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Date:
          <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        </label>
        <label>
          Tax rate (%):
          <input type="number" min={0} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} style={{ width: '70px' }} />
        </label>
        <button type="button" onClick={addItem}>
          Add line item
        </button>
        <button type="button" onClick={handlePrint}>
          Print invoice
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={it.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} style={{ width: '60px' }} />
                </td>
                <td>
                  <input type="number" min={0} value={it.rate} onChange={(e) => updateItem(i, 'rate', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <code>{(rows[i]?.amount ?? 0).toFixed(2)}</code>
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
          <strong>Subtotal:</strong> <code>{subtotal.toFixed(2)}</code>
        </div>
        <div>
          <strong>Tax ({taxRateNum}%):</strong> <code>{taxAmount.toFixed(2)}</code>
        </div>
        <div>
          <strong>Total due:</strong> <code>{total.toFixed(2)}</code>
        </div>
      </div>
      <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>{businessName || 'Your Business Name'}</strong>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', opacity: 0.8 }}>{businessInfo}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>
              <strong>Invoice #:</strong> {invoiceNumber}
            </div>
            <div>
              <strong>Date:</strong> {invoiceDate}
            </div>
          </div>
        </div>
        <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div>
          <strong>Bill to:</strong> {clientName || 'Client Name'}
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', opacity: 0.8 }}>{clientInfo}</div>
        </div>
      </div>
    </div>
  );
}
