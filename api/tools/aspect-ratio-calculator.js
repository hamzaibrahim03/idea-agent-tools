import { createComputeHandler } from '../_lib/computeHandler.js';

function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function simplifyRatio(width, height) {
  const divisor = gcd(width, height);
  return { w: width / divisor, h: height / divisor };
}

function compute({ width, height, knownWidth, ratioW, ratioH }) {
  const widthNum = Number(width);
  const heightNum = Number(height);
  const ratioValid = Number.isFinite(widthNum) && Number.isFinite(heightNum) && widthNum > 0 && heightNum > 0;
  const simplified = ratioValid ? simplifyRatio(widthNum, heightNum) : null;
  const decimalRatio = ratioValid ? widthNum / heightNum : null;

  const knownWidthNum = Number(knownWidth);
  const ratioWNum = Number(ratioW);
  const ratioHNum = Number(ratioH);
  const calcValid =
    Number.isFinite(knownWidthNum) && Number.isFinite(ratioWNum) && Number.isFinite(ratioHNum) &&
    knownWidthNum > 0 && ratioWNum > 0 && ratioHNum > 0;
  const calculatedHeight = calcValid ? (knownWidthNum * ratioHNum) / ratioWNum : null;

  return { ratioValid, simplified, decimalRatio, calcValid, calculatedHeight };
}

export default createComputeHandler(compute);
