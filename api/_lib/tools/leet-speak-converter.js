import { createComputeHandler } from '../computeHandler.js';

const LIGHT_MAP = {
  a: '4', e: '3', i: '1', o: '0', s: '5', t: '7'
};
const AGGRESSIVE_MAP = {
  ...LIGHT_MAP,
  b: '8', g: '9', l: '1', z: '2'
};

function convert(text, map) {
  return [...text]
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (!(lower in map)) return ch;
      return map[lower];
    })
    .join('');
}

function compute({ input, intensity }) {
  const output = convert(input || '', intensity === 'aggressive' ? AGGRESSIVE_MAP : LIGHT_MAP);
  return { output };
}

export default createComputeHandler(compute);
