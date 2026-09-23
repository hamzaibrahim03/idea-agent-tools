import { createComputeHandler } from '../_lib/computeHandler.js';

function convertQuotes(code, targetQuote) {
  const quoteChars = ['"', "'", '`'];
  let result = '';
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (quoteChars.includes(ch)) {
      const openQuote = ch;
      let j = i + 1;
      let content = '';
      while (j < code.length) {
        if (code[j] === '\\' && j + 1 < code.length) {
          content += code[j] + code[j + 1];
          j += 2;
          continue;
        }
        if (code[j] === openQuote) break;
        content += code[j];
        j++;
      }
      if (j >= code.length) {
        result += code.slice(i);
        break;
      }
      const unescaped = content.replace(new RegExp(`\\\\${openQuote}`, 'g'), openQuote);
      const reescaped = unescaped.replace(new RegExp(targetQuote, 'g'), `\\${targetQuote}`);
      result += targetQuote + reescaped + targetQuote;
      i = j + 1;
    } else {
      result += ch;
      i++;
    }
  }
  return result;
}

function compute({ input, targetQuote }) {
  return { output: input ? convertQuotes(input, targetQuote) : '' };
}

export default createComputeHandler(compute);
