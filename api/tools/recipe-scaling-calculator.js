import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ ingredients, originalServings, targetServings }) {
  const list = Array.isArray(ingredients) ? ingredients : [];
  const originalNum = Number(originalServings);
  const targetNum = Number(targetServings);
  const servingsValid = Number.isFinite(originalNum) && originalNum > 0 && Number.isFinite(targetNum) && targetNum > 0;
  const scaleFactor = servingsValid ? targetNum / originalNum : null;
  const rows = list.map((i) => {
    const qty = Number(i.quantity);
    const valid = Number.isFinite(qty) && qty >= 0;
    const scaled = valid && scaleFactor !== null ? qty * scaleFactor : null;
    return { ...i, scaled };
  });
  return { rows, servingsValid, scaleFactor };
}

export default createComputeHandler(compute);
