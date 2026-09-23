import { createComputeHandler } from '../_lib/computeHandler.js';

function solve(a, b, c) {
  if (a === 0) {
    if (b === 0) {
      return c === 0
        ? { kind: 'identity' }
        : { kind: 'no-solution' };
    }
    return { kind: 'linear', root: -c / b };
  }
  const discriminant = b * b - 4 * a * c;
  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    return {
      kind: 'real-distinct',
      x1: (-b + sqrtD) / (2 * a),
      x2: (-b - sqrtD) / (2 * a),
    };
  }
  if (discriminant === 0) {
    return { kind: 'real-repeated', x: -b / (2 * a) };
  }
  const real = -b / (2 * a);
  const imag = Math.sqrt(-discriminant) / (2 * a);
  return { kind: 'complex', real, imag: Math.abs(imag) };
}

function compute({ a, b, c }) {
  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);
  const invalid = a === '' || b === '' || c === '' || [numA, numB, numC].some(Number.isNaN);
  const result = !invalid ? solve(numA, numB, numC) : null;
  return { invalid, result };
}

export default createComputeHandler(compute);
