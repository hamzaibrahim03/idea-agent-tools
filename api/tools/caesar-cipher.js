import { createComputeHandler } from '../_lib/computeHandler.js';

function shiftChar(char, shift) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
  }
  return char;
}
function caesarShift(text, shift) {
  return [...text].map((ch) => shiftChar(ch, shift)).join('');
}

function compute({ input, shift, mode, bruteForce }) {
  const text = input || '';
  if (bruteForce) {
    const variants = Array.from({ length: 26 }, (_, i) => i + 1).map((s) => ({
      shift: s,
      text: caesarShift(text, -s)
    }));
    return { bruteForce: true, variants };
  }
  const effectiveShift = mode === 'encrypt' ? shift : -shift;
  const output = text ? caesarShift(text, effectiveShift) : '';
  return { bruteForce: false, output };
}

export default createComputeHandler(compute);
