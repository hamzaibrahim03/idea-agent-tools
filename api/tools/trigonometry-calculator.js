import { createComputeHandler } from '../_lib/computeHandler.js';

const DEG_TO_RAD = Math.PI / 180;

function compute({ angle, unit }) {
  const angleNum = Number(angle);
  const valid = Number.isFinite(angleNum);
  if (!valid) return { valid: false };
  const rad = unit === 'deg' ? angleNum * DEG_TO_RAD : angleNum;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const cosIsZero = Math.abs(cos) < 1e-12;
  const tan = cosIsZero ? null : Math.tan(rad);
  const converted = unit === 'deg' ? rad : angleNum / DEG_TO_RAD;
  return { valid: true, sin, cos, tan, converted };
}

export default createComputeHandler(compute);
