import { createComputeHandler } from '../computeHandler.js';

function compute({ input, fromBase }) {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { decimalValue: null };
  }
  const cleaned = trimmed.replace(/^0[xXbBoO]/, '');
  const value = parseInt(cleaned, fromBase);
  if (Number.isNaN(value)) {
    throw new Error(`"${input}" is not valid in base ${fromBase}`);
  }
  return { decimalValue: value };
}

export default createComputeHandler(compute);
