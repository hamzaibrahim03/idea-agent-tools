import { createComputeHandler } from '../computeHandler.js';

function toRoman(num) {
  const table = [
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
  ];
  let n = num;
  let result = '';
  for (const [value, symbol] of table) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}
function toLetters(num) {
  let n = num;
  let result = '';
  while (n > 0) {
    n--;
    result = String.fromCharCode(97 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}
const STYLES = {
  bullet: () => '• ',
  dash: () => '- ',
  asterisk: () => '* ',
  numbered: (i) => `${i}. `,
  lettered: (i) => `${toLetters(i)}. `,
  roman: (i) => `${toRoman(i)}. `
};
function formatBullets(text, style) {
  const prefixFn = STYLES[style];
  let count = 0;
  return text
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return line;
      count++;
      return `${prefixFn(count)}${line}`;
    })
    .join('\n');
}

function compute({ input, style }) {
  const output = formatBullets(input || '', style);
  return { output };
}

export default createComputeHandler(compute);
