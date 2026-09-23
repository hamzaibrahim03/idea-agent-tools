import { createComputeHandler } from '../computeHandler.js';

const RATE_RANGES = {
  residential: {
    economy: { low: 100, high: 150 },
    standard: { low: 150, high: 225 },
    premium: { low: 225, high: 400 }
  },
  commercial: {
    economy: { low: 150, high: 200 },
    standard: { low: 200, high: 300 },
    premium: { low: 300, high: 500 }
  }
};
function averageRate(projectType, tier) {
  const range = RATE_RANGES[projectType][tier];
  return (range.low + range.high) / 2;
}

function compute({ projectType, tier, sqft, useCustomRate, customRate, laborShare }) {
  const sqftNum = Number(sqft);
  const customRateNum = Number(customRate);
  const laborShareNum = Number(laborShare);
  const range = RATE_RANGES[projectType][tier];
  const rate = useCustomRate ? customRateNum : averageRate(projectType, tier);
  const valid =
    Number.isFinite(sqftNum) && sqftNum > 0 &&
    Number.isFinite(rate) && rate > 0 &&
    Number.isFinite(laborShareNum) && laborShareNum >= 0 && laborShareNum <= 100;
  if (!valid) {
    throw new Error('Enter a positive square footage, a positive rate, and a labor share between 0 and 100%.');
  }
  const totalLow = sqftNum * (useCustomRate ? rate : range.low);
  const totalHigh = sqftNum * (useCustomRate ? rate : range.high);
  const totalMid = sqftNum * rate;
  const laborCost = totalMid * (laborShareNum / 100);
  const materialCost = totalMid - laborCost;
  return { valid, range, rate, totalLow, totalHigh, totalMid, laborCost, materialCost };
}

export default createComputeHandler(compute);
