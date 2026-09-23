import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ mode, base, exponent, radicand, rootDegree }) {
  const baseNum = Number(base);
  const exponentNum = Number(exponent);
  const radicandNum = Number(radicand);
  const rootDegreeNum = Number(rootDegree);
  let result = null;
  if (mode === 'power') {
    if (Number.isFinite(baseNum) && Number.isFinite(exponentNum)) {
      result = baseNum ** exponentNum;
      if (!Number.isFinite(result)) throw new Error('Result is too large or undefined.');
    } else {
      throw new Error('Enter valid numbers.');
    }
  } else {
    if (!Number.isFinite(radicandNum) || !Number.isFinite(rootDegreeNum) || rootDegreeNum === 0) {
      throw new Error('Enter a valid radicand and a non-zero root degree.');
    } else if (radicandNum < 0 && rootDegreeNum % 2 === 0) {
      throw new Error('Even root of a negative number is not a real number.');
    } else {
      const sign = radicandNum < 0 ? -1 : 1;
      result = sign * Math.abs(radicandNum) ** (1 / rootDegreeNum);
    }
  }
  return { result };
}

export default createComputeHandler(compute);
