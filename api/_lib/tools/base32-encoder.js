import { createComputeHandler } from '../computeHandler.js';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function encodeBase32(bytes) {
  let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    output += ALPHABET[parseInt(chunk, 2)];
  }
  while (output.length % 8 !== 0) output += '=';
  return output;
}
function decodeBase32(str) {
  const clean = str.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (const ch of clean) {
    const index = ALPHABET.indexOf(ch);
    if (index === -1) throw new Error(`Invalid Base32 character: "${ch}"`);
    bits += index.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}
function textToBase32(text) {
  return encodeBase32(Buffer.from(text, 'utf-8'));
}
function base32ToText(str) {
  const bytes = decodeBase32(str);
  return bytes.toString('utf-8');
}

function compute({ input, mode }) {
  let output = '';
  let error = '';
  if (input) {
    try {
      output = mode === 'encode' ? textToBase32(input) : base32ToText(input);
    } catch (e) {
      error = mode === 'encode' ? 'Unable to encode this input.' : e.message || 'Invalid Base32 input.';
    }
  }
  return { output, error };
}

export default createComputeHandler(compute);
