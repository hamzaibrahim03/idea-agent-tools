import { createComputeHandler } from '../_lib/computeHandler.js';

function parseVector(text) {
  const parts = String(text || '').split(',').map((s) => Number(s.trim()));
  if (parts.length < 2 || parts.length > 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts;
}
function pad(v) {
  return v.length === 2 ? [...v, 0] : v;
}
function add(a, b) {
  return a.map((v, i) => v + b[i]);
}
function sub(a, b) {
  return a.map((v, i) => v - b[i]);
}
function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function cross(a, b) {
  const [a1, a2, a3] = pad(a);
  const [b1, b2, b3] = pad(b);
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
}
function magnitude(v) {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
}
function format(v) {
  return `(${v.map((n) => Number(n.toFixed(6))).join(', ')})`;
}

function compute({ vecA, vecB }) {
  const a = parseVector(vecA);
  const b = parseVector(vecB);
  const valid = a !== null && b !== null;
  if (!valid) return { valid: false };
  const same2D = String(vecA).split(',').length === String(vecB).split(',').length;
  const magA = magnitude(a);
  const magB = magnitude(b);
  const sumVec = same2D ? add(a, b) : null;
  const diffVec = same2D ? sub(a, b) : null;
  const dotProduct = same2D ? dot(a, b) : null;
  const crossProduct = cross(a, b);
  const angleRad = same2D && magA > 0 && magB > 0 ? Math.acos(Math.min(1, Math.max(-1, dotProduct / (magA * magB)))) : null;
  return {
    valid: true,
    same2D,
    magA,
    magB,
    sumVec: sumVec ? format(sumVec) : null,
    diffVec: diffVec ? format(diffVec) : null,
    dotProduct,
    crossProduct: format(crossProduct),
    angleDeg: angleRad !== null ? angleRad * (180 / Math.PI) : null
  };
}

export default createComputeHandler(compute);
