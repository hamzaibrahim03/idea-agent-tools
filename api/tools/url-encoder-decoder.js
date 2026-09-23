import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ action, input }) {
  const text = String(input || '');
  if (action === 'decode') {
    if (!text) return { output: '' };
    try {
      return { output: decodeURIComponent(text) };
    } catch (e) {
      throw new Error(e.message);
    }
  }
  return { output: text ? encodeURIComponent(text) : '' };
}

export default createComputeHandler(compute);
