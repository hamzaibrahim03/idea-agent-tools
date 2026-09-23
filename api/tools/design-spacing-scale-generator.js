import { createComputeHandler } from '../_lib/computeHandler.js';

const LINEAR_MULTIPLES = [0.5, 1, 2, 3, 4, 6, 8, 12, 16];
const GEOMETRIC_STEPS = 8;

function buildLinearScale(base) {
  return LINEAR_MULTIPLES.map((m) => Math.round(base * m * 100) / 100);
}

function buildGeometricScale(base, ratio) {
  const values = [];
  for (let i = 0; i < GEOMETRIC_STEPS; i++) {
    values.push(Math.round(base * Math.pow(ratio, i) * 100) / 100);
  }
  return values;
}

function compute({ base, scaleType, ratio }) {
  const baseNum = parseFloat(base) || 0;
  const ratioNum = parseFloat(ratio) || 1;
  const scale = scaleType === 'linear' ? buildLinearScale(baseNum) : buildGeometricScale(baseNum, ratioNum);
  const uniqueScale = [...new Set(scale)];
  const cssVars = uniqueScale.map((v, i) => `  --space-${i + 1}: ${v}px;`).join('\n');
  const cssOutput = `:root {\n${cssVars}\n}`;
  return { uniqueScale, cssOutput };
}

export default createComputeHandler(compute);
