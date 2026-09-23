import { createComputeHandler } from '../computeHandler.js';

function toPx(value, unit, basePx) {
  switch (unit) {
    case 'px': return value;
    case 'rem': return value * basePx;
    case 'em': return value * basePx;
    case 'pt': return value * (96 / 72);
    case '%': return (value / 100) * basePx;
    default: return value;
  }
}
function fromPx(px, unit, basePx) {
  switch (unit) {
    case 'px': return px;
    case 'rem': return px / basePx;
    case 'em': return px / basePx;
    case 'pt': return px * (72 / 96);
    case '%': return (px / basePx) * 100;
    default: return px;
  }
}
const UNITS = ['px', 'rem', 'em', 'pt', '%'];

function compute({ value, fromUnit, basePx }) {
  const valueNum = Number(value);
  const baseNum = Number(basePx);
  const valid = Number.isFinite(valueNum) && Number.isFinite(baseNum) && baseNum > 0;
  if (!valid) return { valid: false };
  const px = toPx(valueNum, fromUnit, baseNum);
  const results = UNITS.map((u) => ({ unit: u, value: Number(fromPx(px, u, baseNum).toFixed(4)) }));
  return { valid: true, results };
}

export default createComputeHandler(compute);
