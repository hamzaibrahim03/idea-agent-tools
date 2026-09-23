import { createComputeHandler } from '../_lib/computeHandler.js';

function unitPrice(price, quantity) {
  const p = Number(price);
  const q = Number(quantity);
  if (!price || !quantity || Number.isNaN(p) || Number.isNaN(q) || q <= 0 || p < 0) return null;
  return p / q;
}

function compute({ priceA, qtyA, priceB, qtyB }) {
  const perUnitA = unitPrice(priceA, qtyA);
  const perUnitB = unitPrice(priceB, qtyB);
  let winner = null;
  if (perUnitA !== null && perUnitB !== null) {
    if (perUnitA < perUnitB) winner = 'A';
    else if (perUnitB < perUnitA) winner = 'B';
    else winner = 'tie';
  }
  const savingsPct =
    winner === 'A' || winner === 'B'
      ? Math.abs(((perUnitA - perUnitB) / Math.max(perUnitA, perUnitB)) * 100)
      : null;
  return { perUnitA, perUnitB, winner, savingsPct };
}

export default createComputeHandler(compute);
