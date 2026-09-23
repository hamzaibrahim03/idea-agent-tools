import { createComputeHandler } from '../_lib/computeHandler.js';

function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
function fromRadius(r) {
  return {
    radius: r,
    diameter: 2 * r,
    circumference: 2 * Math.PI * r,
    area: Math.PI * r * r
  };
}

function compute({ field, value }) {
  const num = Number(value);
  if (value === '' || value === undefined || value === null || Number.isNaN(num) || num <= 0) {
    throw new Error('Enter a positive number.');
  }
  let radius;
  if (field === 'radius') radius = num;
  else if (field === 'diameter') radius = num / 2;
  else if (field === 'circumference') radius = num / (2 * Math.PI);
  else radius = Math.sqrt(num / Math.PI);
  const result = fromRadius(radius);
  return {
    result: {
      radius: formatNum(result.radius),
      diameter: formatNum(result.diameter),
      circumference: formatNum(result.circumference),
      area: formatNum(result.area)
    }
  };
}

export default createComputeHandler(compute);
