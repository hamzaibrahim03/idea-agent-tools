import { createComputeHandler } from '../computeHandler.js';

function compute({ projectName, items }) {
  const list = Array.isArray(items) ? items : [];
  const rows = list.map((it) => {
    const qty = Number(it.quantity);
    const rate = Number(it.rate);
    const validRow = Number.isFinite(qty) && Number.isFinite(rate);
    const amount = validRow ? qty * rate : 0;
    return { ...it, amount, validRow };
  });
  const grandTotal = rows.reduce((sum, r) => sum + r.amount, 0);

  const header = `Bill of Quantities${projectName ? ` - ${projectName}` : ''}`;
  const lines = [header, ''];
  lines.push(['#', 'Description', 'Unit', 'Quantity', 'Rate', 'Amount'].join('\t'));
  rows.forEach((r, i) => {
    lines.push([i + 1, r.description, r.unit, r.quantity, r.rate, r.amount.toFixed(2)].join('\t'));
  });
  lines.push('');
  lines.push(`Grand Total\t\t\t\t\t${grandTotal.toFixed(2)}`);
  const plainText = lines.join('\n');

  return { rows, grandTotal, plainText };
}

export default createComputeHandler(compute);
