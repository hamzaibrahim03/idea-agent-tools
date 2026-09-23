import { createComputeHandler } from '../computeHandler.js';

function compute({ actualWeight, length, width, height, unit, baseRate, perUnitRate }) {
  const weightNum = parseFloat(actualWeight) || 0;
  const lengthNum = parseFloat(length) || 0;
  const widthNum = parseFloat(width) || 0;
  const heightNum = parseFloat(height) || 0;
  const baseRateNum = parseFloat(baseRate) || 0;
  const perUnitRateNum = parseFloat(perUnitRate) || 0;
  const divisor = unit === 'in' ? 139 : 5000;
  const dimWeight = (lengthNum * widthNum * heightNum) / divisor;
  const billedWeight = Math.max(weightNum, dimWeight);
  const cost = baseRateNum + billedWeight * perUnitRateNum;
  return { dimWeight, billedWeight, cost };
}

export default createComputeHandler(compute);
