import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ solveFor, a, b, c }) {
  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);
  let result = null;
  let error = '';
  if (solveFor === 'c') {
    if (a === '' || b === '' || Number.isNaN(numA) || Number.isNaN(numB) || numA <= 0 || numB <= 0) {
      error = 'Enter positive numbers for a and b.';
    } else {
      result = Math.sqrt(numA * numA + numB * numB);
    }
  } else if (solveFor === 'a') {
    if (b === '' || c === '' || Number.isNaN(numB) || Number.isNaN(numC) || numB <= 0 || numC <= 0) {
      error = 'Enter positive numbers for b and c.';
    } else if (numC <= numB) {
      error = 'The hypotenuse c must be longer than leg b.';
    } else {
      result = Math.sqrt(numC * numC - numB * numB);
    }
  } else {
    if (a === '' || c === '' || Number.isNaN(numA) || Number.isNaN(numC) || numA <= 0 || numC <= 0) {
      error = 'Enter positive numbers for a and c.';
    } else if (numC <= numA) {
      error = 'The hypotenuse c must be longer than leg a.';
    } else {
      result = Math.sqrt(numC * numC - numA * numA);
    }
  }
  return { result, domainError: error };
}

export default createComputeHandler(compute);
