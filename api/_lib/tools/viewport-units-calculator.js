import { createComputeHandler } from '../computeHandler.js';

function pxToViewportUnits(px, vw, vh) {
  const vwValue = (px / vw) * 100;
  const vhValue = (px / vh) * 100;
  return {
    vw: vwValue,
    vh: vhValue,
    vmin: Math.min(vwValue, vhValue),
    vmax: Math.max(vwValue, vhValue)
  };
}

function viewportUnitToPx(value, unit, vw, vh) {
  switch (unit) {
    case 'vw':
      return (value / 100) * vw;
    case 'vh':
      return (value / 100) * vh;
    case 'vmin':
      return (value / 100) * Math.min(vw, vh);
    case 'vmax':
      return (value / 100) * Math.max(vw, vh);
    default:
      return null;
  }
}

function compute({ viewportWidth, viewportHeight, pxValue, reverseValue, reverseUnit }) {
  const vwNum = Number(viewportWidth);
  const vhNum = Number(viewportHeight);
  const viewportValid = Number.isFinite(vwNum) && Number.isFinite(vhNum) && vwNum > 0 && vhNum > 0;
  if (!viewportValid) return { viewportValid: false };
  const pxNum = Number(pxValue);
  const forwardValid = Number.isFinite(pxNum);
  const forwardResult = forwardValid ? pxToViewportUnits(pxNum, vwNum, vhNum) : null;
  const reverseNum = Number(reverseValue);
  const reverseValid = Number.isFinite(reverseNum);
  const reversePx = reverseValid ? viewportUnitToPx(reverseNum, reverseUnit, vwNum, vhNum) : null;
  return { viewportValid: true, forwardResult, reversePx };
}

export default createComputeHandler(compute);
