import { webcrypto } from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

function randomInRange(min, max) {
  const buf = new Uint32Array(1);
  webcrypto.getRandomValues(buf);
  const fraction = buf[0] / 0x100000000;
  return min + fraction * (max - min);
}
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n) => Math.round(f(n) * 255).toString(16).padStart(2, '0');
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}
function randomSwatch() {
  const h = Math.floor(randomInRange(0, 360));
  const s = Math.round(randomInRange(55, 85));
  const l = Math.round(randomInRange(45, 70));
  return { hex: hslToHex(h, s, l), h, s, l };
}
function generatePalette() {
  return Array.from({ length: 5 }, randomSwatch);
}

function compute() {
  return { palette: generatePalette() };
}

export default createComputeHandler(compute);
