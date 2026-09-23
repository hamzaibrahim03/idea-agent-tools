import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ breakpoints }) {
  const list = Array.isArray(breakpoints) ? breakpoints : [];
  const sorted = [...list].sort((a, b) => a.value - b.value);
  const cssOutput = sorted
    .map((b) => `@media (min-width: ${b.value}px) {\n  /* ${b.label} styles */\n}`)
    .join('\n\n');
  return { cssOutput };
}

export default createComputeHandler(compute);
