import { createComputeHandler } from '../computeHandler.js';

function expandLeadingTabs(line, tabWidth) {
  let result = '';
  let column = 0;
  let i = 0;
  while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
    if (line[i] === '\t') {
      const spaces = tabWidth - (column % tabWidth);
      result += ' '.repeat(spaces);
      column += spaces;
    } else {
      result += ' ';
      column += 1;
    }
    i++;
  }
  return result + line.slice(i);
}
function convertIndentation(code, mode, spaceWidth, tabWidth) {
  return code
    .split('\n')
    .map((line) => {
      const expanded = expandLeadingTabs(line, tabWidth);
      const leadingSpaces = expanded.match(/^ */)[0].length;
      const rest = expanded.slice(leadingSpaces);
      const levels = Math.floor(leadingSpaces / spaceWidth);
      const remainder = leadingSpaces % spaceWidth;
      if (mode === 'tabs') {
        return '\t'.repeat(levels) + ' '.repeat(remainder) + rest;
      }
      return ' '.repeat(leadingSpaces) + rest;
    })
    .join('\n');
}

function compute({ input, mode, width }) {
  const output = input ? convertIndentation(input, mode, width, width) : '';
  return { output };
}

export default createComputeHandler(compute);
