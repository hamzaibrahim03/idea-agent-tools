import { useState } from 'react';
export default function BoqGenerator() {
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState([
    { description: 'Excavation', unit: 'm3', quantity: '50', rate: '12' },
    { description: 'PCC (1:4:8)', unit: 'm3', quantity: '10', rate: '95' }
  ]);
  const [copied, setCopied] = useState(false);
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: '', unit: '', quantity: '', rate: '' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  const rows = items.map((it) => {
    const qty = Number(it.quantity);
    const rate = Number(it.rate);
    const validRow = Number.isFinite(qty) && Number.isFinite(rate);
    const amount = validRow ? qty * rate : 0;
    return { ...it, amount, validRow };
  });
  const grandTotal = rows.reduce((sum, r) => sum + r.amount, 0);
  function buildPlainText() {
    const header = `Bill of Quantities${projectName ? ` - ${projectName}` : ''}`;
    const lines = [header, ''];
    lines.push(['#', 'Description', 'Unit', 'Quantity', 'Rate', 'Amount'].join('\t'));
    rows.forEach((r, i) => {
      lines.push([i + 1, r.description, r.unit, r.quantity, r.rate, r.amount.toFixed(2)].join('\t'));
    });
    lines.push('');
    lines.push(`Grand Total\t\t\t\t\t${grandTotal.toFixed(2)}`);
    return lines.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handlePrint() {
    window.print();
  }
  return (
    <div className="tool-page">
      <h1>Bill of Quantities (BOQ) Generator</h1>
      <p className="tool-description">
        Build a Bill of Quantities by adding line items with description, unit, quantity, and rate -
        the tool computes each line's amount and a grand total, and gives you a clean copyable or
        printable table. This is a planning tool for organizing quantities and pricing, not a
        substitute for a licensed quantity surveyor's official BOQ. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="project-name">Project name (optional)</label>
        <input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Riverside Residence - Phase 1"
        />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addItem}>
          Add line item
        </button>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy as table'}
        </button>
        <button type="button" onClick={handlePrint}>
          Print
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    value={r.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    placeholder="e.g. Brickwork in cement mortar"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={r.unit}
                    onChange={(e) => updateItem(i, 'unit', e.target.value)}
                    placeholder="m2"
                    style={{ width: '70px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.quantity}
                    onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.rate}
                    onChange={(e) => updateItem(i, 'rate', e.target.value)}
                    style={{ width: '90px' }}
                  />
                </td>
                <td>
                  <code>{r.validRow ? r.amount.toFixed(2) : '—'}</code>
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
          <strong>Grand total:</strong> <code>{grandTotal.toFixed(2)}</code>
        </div>
      </div>
    </div>
  );
}
