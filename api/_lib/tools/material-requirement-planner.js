import { createComputeHandler } from '../computeHandler.js';

function compute({ targetQty, components }) {
  const targetNum = Number(targetQty);
  const targetValid = Number.isFinite(targetNum) && targetNum > 0;
  const list = Array.isArray(components) ? components : [];
  const rows = list.map((c) => {
    const qty = Number(c.qtyPerUnit);
    const validRow = Number.isFinite(qty) && qty >= 0;
    const totalNeeded = validRow && targetValid ? qty * targetNum : null;
    return { ...c, qty, validRow, totalNeeded };
  });
  return { targetValid, rows };
}

export default createComputeHandler(compute);
