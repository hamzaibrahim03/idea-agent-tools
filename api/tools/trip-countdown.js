import { createComputeHandler } from '../_lib/computeHandler.js';

// Only the target-date validation round-trips to the server. The live
// per-second countdown display must stay client-side (wall-clock
// arithmetic, no meaningful input per tick), so the component keeps its
// own local breakdown() function for ticking between calls to this route.
function compute({ targetInput }) {
  const target = new Date(targetInput);
  if (Number.isNaN(target.getTime())) {
    throw new Error('Enter a valid departure date/time.');
  }
  return { targetMs: target.getTime() };
}

export default createComputeHandler(compute);
