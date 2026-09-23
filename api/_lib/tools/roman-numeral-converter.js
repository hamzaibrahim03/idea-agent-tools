import { createComputeHandler } from '../computeHandler.js';

const VALUES = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];
const ROMAN_PATTERN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

function toRoman(num) {
  let result = '';
  let remaining = num;
  for (const [value, symbol] of VALUES) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
function fromRoman(str) {
  let result = 0;
  let i = 0;
  for (const [value, symbol] of VALUES) {
    while (str.slice(i, i + symbol.length) === symbol) {
      result += value;
      i += symbol.length;
    }
  }
  return result;
}
function looksLikeRoman(str) {
  return /^[IVXLCDM]+$/i.test(str.trim());
}

function compute({ input }) {
  const trimmed = (input || '').trim();
  let output = '';
  let errorMsg = '';
  if (trimmed) {
    if (looksLikeRoman(trimmed)) {
      const upper = trimmed.toUpperCase();
      if (!ROMAN_PATTERN.test(upper) || !upper.length) {
        errorMsg = `"${trimmed}" is not a valid Roman numeral.`;
      } else {
        output = String(fromRoman(upper));
      }
    } else if (/^-?\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      if (num < 1 || num > 3999) {
        errorMsg = 'Enter a whole number between 1 and 3999.';
      } else {
        output = toRoman(num);
      }
    } else {
      errorMsg = `"${trimmed}" is not a valid number or Roman numeral.`;
    }
  }
  return { output, validationError: errorMsg };
}

export default createComputeHandler(compute);
