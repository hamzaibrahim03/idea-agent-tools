import { createComputeHandler } from '../_lib/computeHandler.js';

function toSentenceCase(text) {
  if (!text) return '';
  const lowered = text.toLowerCase();
  const segments = lowered.match(/[^.!?]*[.!?]+|[^.!?]+$/g) || [];
  return segments
    .map((segment) => {
      const match = segment.match(/[a-z0-9]/i);
      if (!match) return segment;
      const idx = segment.indexOf(match[0]);
      return segment.slice(0, idx) + segment[idx].toUpperCase() + segment.slice(idx + 1);
    })
    .join('');
}

function compute({ input }) {
  return { output: toSentenceCase(input || '') };
}

export default createComputeHandler(compute);
