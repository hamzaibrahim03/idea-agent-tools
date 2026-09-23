import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ ingredients, servings }) {
  const list = Array.isArray(ingredients) ? ingredients : [];
  const rows = list.map((i) => {
    const cost = Number(i.costPerUnit);
    const qty = Number(i.quantity);
    const valid = Number.isFinite(cost) && cost >= 0 && Number.isFinite(qty) && qty >= 0;
    return { ...i, subtotal: valid ? cost * qty : null };
  });
  const totalRecipeCost = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const servingsNum = Number(servings);
  const servingsValid = Number.isFinite(servingsNum) && servingsNum > 0;
  const costPerServing = servingsValid ? totalRecipeCost / servingsNum : null;
  return { rows, totalRecipeCost, servingsValid, costPerServing };
}

export default createComputeHandler(compute);
