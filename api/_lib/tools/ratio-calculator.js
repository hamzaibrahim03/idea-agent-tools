import { createComputeHandler } from '../computeHandler.js';

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function compute({ a, b, c, d }) {
  a = a ?? '';
  b = b ?? '';
  c = c ?? '';
  d = d ?? '';
  const aNum = Number(a);
  const bNum = Number(b);
  const cNum = Number(c);
  const dNum = Number(d);
  const blanks = [a, b, c, d].filter((v) => String(v).trim() === '').length;
  const valid = blanks === 1 && [a, b, c, d].every((v) => String(v).trim() === '' || Number.isFinite(Number(v)));
  let solved = null;
  let solvedField = null;
  if (valid) {
    if (String(a).trim() === '') {
      solved = (bNum * cNum) / dNum;
      solvedField = 'a';
    } else if (String(b).trim() === '') {
      solved = (aNum * dNum) / cNum;
      solvedField = 'b';
    } else if (String(c).trim() === '') {
      solved = (aNum * dNum) / bNum;
      solvedField = 'c';
    } else if (String(d).trim() === '') {
      solved = (bNum * cNum) / aNum;
      solvedField = 'd';
    }
  }
  const simplifyValid = Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== 0 && bNum !== 0;
  const g = simplifyValid ? gcd(aNum, bNum) : 1;
  const simplified = simplifyValid ? `${aNum / g} : ${bNum / g}` : null;
  return { valid, solved, solvedField, simplifyValid, simplified };
}

export default createComputeHandler(compute);
