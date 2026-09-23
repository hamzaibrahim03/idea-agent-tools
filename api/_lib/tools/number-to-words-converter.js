import { createComputeHandler } from '../computeHandler.js';

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', ' thousand', ' million', ' billion'];
const MAX_VALUE = 999999999999;

function threeDigitsToWords(n) {
  const parts = [];
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds > 0) parts.push(`${ONES[hundreds]} hundred`);
  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      parts.push(ones > 0 ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
    }
  }
  return parts.join(' ');
}

function numberToWords(value) {
  if (!Number.isInteger(value)) return null;
  if (value === 0) return 'zero';
  const negative = value < 0;
  let n = Math.abs(value);
  if (n > MAX_VALUE) return null;
  const groups = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const words = groups
    .map((group, i) => (group > 0 ? threeDigitsToWords(group) + SCALES[i] : ''))
    .filter(Boolean)
    .reverse()
    .join(' ');
  return (negative ? 'negative ' : '') + words;
}

function compute({ input }) {
  const trimmed = (input || '').trim();
  if (trimmed === '') return { words: '' };
  const num = Number(input);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    throw new Error('Enter a whole number.');
  }
  if (Math.abs(num) > MAX_VALUE) {
    throw new Error(`Number is too large. Max supported is ${MAX_VALUE.toLocaleString()}.`);
  }
  return { words: numberToWords(num) };
}

export default createComputeHandler(compute);
