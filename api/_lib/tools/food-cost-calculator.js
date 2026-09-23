import { createComputeHandler } from '../computeHandler.js';

function compute({ ingredients, sellingPrice }) {
  const list = Array.isArray(ingredients) ? ingredients : [];
  const rows = list.map((i) => {
    const cost = Number(i.costPerUnit);
    const qty = Number(i.quantity);
    const valid = Number.isFinite(cost) && cost >= 0 && Number.isFinite(qty) && qty >= 0;
    return { ...i, subtotal: valid ? cost * qty : null };
  });
  const totalFoodCost = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const priceNum = Number(sellingPrice);
  const priceValid = Number.isFinite(priceNum) && priceNum > 0;
  const foodCostPercent = priceValid ? (totalFoodCost / priceNum) * 100 : null;
  const grossProfit = priceValid ? priceNum - totalFoodCost : null;
  return { rows, totalFoodCost, priceValid, foodCostPercent, grossProfit };
}

export default createComputeHandler(compute);
