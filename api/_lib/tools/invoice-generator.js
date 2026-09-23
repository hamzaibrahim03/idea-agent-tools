import { createComputeHandler } from '../computeHandler.js';

function compute({ items, taxRate }) {
  const list = Array.isArray(items) ? items : [];
  const rows = list.map((it) => {
    const qty = Number(it.qty) || 0;
    const rate = Number(it.rate) || 0;
    return { ...it, amount: qty * rate };
  });
  const subtotal = rows.reduce((sum, r) => sum + r.amount, 0);
  const taxRateNum = Number(taxRate) || 0;
  const taxAmount = subtotal * (taxRateNum / 100);
  const total = subtotal + taxAmount;
  return { rows, subtotal, taxAmount, total };
}

export default createComputeHandler(compute);
