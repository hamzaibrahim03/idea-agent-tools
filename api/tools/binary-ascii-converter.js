import { createComputeHandler } from '../_lib/computeHandler.js';

function textToBinary(text) {
  const bytes = Buffer.from(text, 'utf-8');
  return Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join(' ');
}
function textToHex(text) {
  const bytes = Buffer.from(text, 'utf-8');
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
}
function binaryToText(code) {
  const chunks = code.trim().split(/\s+/).filter(Boolean);
  if (chunks.some((c) => !/^[01]{1,8}$/.test(c))) {
    throw new Error('Binary input must be groups of 0s and 1s (up to 8 bits each), separated by spaces.');
  }
  const bytes = Buffer.from(chunks.map((c) => parseInt(c, 2)));
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Could not decode that input.');
  }
}
function hexToText(code) {
  const chunks = code.trim().split(/\s+/).filter(Boolean);
  if (chunks.some((c) => !/^[0-9a-fA-F]{1,2}$/.test(c))) {
    throw new Error('Hex input must be one or two hex digits per byte, separated by spaces.');
  }
  const bytes = Buffer.from(chunks.map((c) => parseInt(c, 16)));
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Could not decode that input.');
  }
}

function compute({ mode, direction, input }) {
  let output = '';
  if (input) {
    if (direction === 'toCode') {
      output = mode === 'Binary' ? textToBinary(input) : textToHex(input);
    } else {
      output = mode === 'Binary' ? binaryToText(input) : hexToText(input);
    }
  }
  return { output };
}

export default createComputeHandler(compute);
