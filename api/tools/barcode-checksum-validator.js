import { createComputeHandler } from '../_lib/computeHandler.js';

function computeCheckDigit(digitsWithoutCheck) {
  let sum = 0;
  for (let i = 0; i < digitsWithoutCheck.length; i++) {
    const digit = digitsWithoutCheck[digitsWithoutCheck.length - 1 - i];
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}
function validateBarcode(code) {
  const clean = code.replace(/\s/g, '');
  if (!/^\d+$/.test(clean)) return { error: 'Barcode must contain only digits.' };
  if (![8, 12, 13, 14].includes(clean.length)) {
    return { error: 'Expected length 8 (EAN-8), 12 (UPC-A), 13 (EAN-13), or 14 (GTIN-14) digits.' };
  }
  const digits = clean.split('').map(Number);
  const body = digits.slice(0, -1);
  const providedCheck = digits[digits.length - 1];
  const expectedCheck = computeCheckDigit(body);
  return { valid: providedCheck === expectedCheck, expectedCheck, providedCheck, length: clean.length };
}

function compute({ code, generateBody }) {
  const result = (code || '').trim() ? validateBarcode(code) : null;
  const generateClean = (generateBody || '').replace(/\s/g, '');
  const generateValid = /^\d+$/.test(generateClean) && [7, 11, 12, 13].includes(generateClean.length);
  const generatedCheckDigit = generateValid ? computeCheckDigit(generateClean.split('').map(Number)) : null;
  return { result, generateClean, generateValid, generatedCheckDigit };
}

export default createComputeHandler(compute);
