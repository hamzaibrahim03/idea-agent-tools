import { createComputeHandler } from '../computeHandler.js';

function compute({ input, indent }) {
  if (!input || !String(input).trim()) {
    return { formatted: '' };
  }
  try {
    const formatted = JSON.stringify(JSON.parse(input), null, indent);
    return { formatted };
  } catch (e) {
    throw new Error(e.message);
  }
}

export default createComputeHandler(compute);
