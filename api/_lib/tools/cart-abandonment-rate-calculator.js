import { createComputeHandler } from '../computeHandler.js';

function calculate(carts, purchases) {
  if (carts <= 0) return null;
  const abandoned = Math.max(carts - purchases, 0);
  const rate = (abandoned / carts) * 100;
  return { abandoned, rate };
}

function compute({ carts, purchases }) {
  const cartsNum = parseFloat(carts) || 0;
  const purchasesNum = parseFloat(purchases) || 0;
  const result = calculate(cartsNum, purchasesNum);
  return { result };
}

export default createComputeHandler(compute);
