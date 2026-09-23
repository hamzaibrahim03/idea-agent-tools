import { createComputeHandler } from '../_lib/computeHandler.js';

function hexToRgb(hex) {
  const clean = (hex || '').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(rgb, target, percent) {
  const p = percent / 100;
  return {
    r: rgb.r + (target - rgb.r) * p,
    g: rgb.g + (target - rgb.g) * p,
    b: rgb.b + (target - rgb.b) * p
  };
}

const TINT_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const SHADE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

function compute({ hex }) {
  const rgb = hexToRgb(hex);
  const valid = !!rgb;
  const tints = valid ? TINT_STEPS.map((p) => ({ percent: p, hex: rgbToHex(mix(rgb, 255, p)) })) : [];
  const shades = valid ? SHADE_STEPS.map((p) => ({ percent: p, hex: rgbToHex(mix(rgb, 0, p)) })) : [];
  return { valid, tints, shades };
}

export default createComputeHandler(compute);
