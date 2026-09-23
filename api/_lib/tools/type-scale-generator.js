import { createComputeHandler } from '../computeHandler.js';

const STEPS = [
  { key: 'small', label: 'Small', power: -1 },
  { key: 'body', label: 'Body', power: 0 },
  { key: 'h6', label: 'H6', power: 1 },
  { key: 'h5', label: 'H5', power: 2 },
  { key: 'h4', label: 'H4', power: 3 },
  { key: 'h3', label: 'H3', power: 4 },
  { key: 'h2', label: 'H2', power: 5 },
  { key: 'h1', label: 'H1', power: 6 }
];

function compute({ baseSize, ratio }) {
  const base = parseFloat(baseSize) || 16;
  const r = parseFloat(ratio) || 1.25;
  const scale = STEPS.map((s) => ({
    ...s,
    size: Math.round(base * Math.pow(r, s.power) * 100) / 100
  }));
  const cssVars = scale.map((s) => `  --font-${s.key}: ${s.size}px;`).join('\n');
  const cssOutput = `:root {\n${cssVars}\n}`;
  return { scale, cssOutput };
}

export default createComputeHandler(compute);
