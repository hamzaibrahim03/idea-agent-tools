import { createComputeHandler } from '../_lib/computeHandler.js';

function computedFor(p) {
  const price = Number(p.price);
  const sqft = Number(p.sqft);
  const taxRate = Number(p.taxRate);
  const pricePerSqft = price > 0 && sqft > 0 ? price / sqft : null;
  const annualTax = price > 0 && Number.isFinite(taxRate) && taxRate > 0 ? price * (taxRate / 100) : null;
  return { pricePerSqft, annualTax };
}

function compute({ properties }) {
  const results = (properties || []).map((p) => computedFor(p));
  return { results };
}

export default createComputeHandler(compute);
