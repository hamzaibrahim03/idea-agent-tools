import { createComputeHandler } from '../_lib/computeHandler.js';

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function simplify(num, den) {
  if (den === 0) return null;
  const sign = den < 0 ? -1 : 1;
  num *= sign;
  den *= sign;
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

function operate(a, b, op) {
  switch (op) {
    case 'add':
      return simplify(a.num * b.den + b.num * a.den, a.den * b.den);
    case 'sub':
      return simplify(a.num * b.den - b.num * a.den, a.den * b.den);
    case 'mul':
      return simplify(a.num * b.num, a.den * b.den);
    case 'div':
      return simplify(a.num * b.den, a.den * b.num);
    default:
      return null;
  }
}

function compute({ num1, den1, op, num2, den2 }) {
  const n1 = parseInt(num1, 10);
  const d1 = parseInt(den1, 10);
  const n2 = parseInt(num2, 10);
  const d2 = parseInt(den2, 10);
  const valid = [n1, d1, n2, d2].every(Number.isFinite) && d1 !== 0 && d2 !== 0 && !(op === 'div' && n2 === 0);
  if (!valid) {
    throw new Error('Enter whole numbers with non-zero denominators (and a non-zero second numerator for division).');
  }
  const result = operate({ num: n1, den: d1 }, { num: n2, den: d2 }, op);
  const decimal = result ? result.num / result.den : null;
  const mixed = result && Math.abs(result.num) >= Math.abs(result.den)
    ? {
        whole: Math.trunc(result.num / result.den),
        remainder: Math.abs(result.num % result.den)
      }
    : null;
  return { valid, result, decimal, mixed };
}

export default createComputeHandler(compute);
