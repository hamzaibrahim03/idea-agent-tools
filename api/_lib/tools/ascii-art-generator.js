import { createComputeHandler } from '../computeHandler.js';

const FONT = {
  A: [' # ', '# #', '###'], B: ['## ', '## ', '## '], C: [' ##', '#  ', ' ##'],
  D: ['## ', '# #', '## '], E: ['###', '## ', '###'], F: ['###', '## ', '#  '],
  G: [' ##', '# #', ' ##'], H: ['# #', '###', '# #'], I: ['###', ' # ', '###'],
  J: ['  #', '  #', '## '], K: ['# #', '## ', '# #'], L: ['#  ', '#  ', '###'],
  M: ['# #', '###', '# #'], N: ['## ', '# #', ' ##'], O: [' # ', '# #', ' # '],
  P: ['## ', '###', '#  '], Q: [' # ', '# #', ' ##'], R: ['## ', '###', '# #'],
  S: [' ##', ' # ', '## '], T: ['###', ' # ', ' # '], U: ['# #', '# #', '###'],
  V: ['# #', '# #', ' # '], W: ['# #', '###', '# #'], X: ['# #', ' # ', '# #'],
  Y: ['# #', ' # ', ' # '], Z: ['###', ' # ', '###'],
  0: [' # ', '# #', ' # '], 1: [' # ', ' # ', ' # '], 2: ['## ', ' # ', '###'],
  3: ['## ', ' ##', '## '], 4: ['# #', '###', '  #'], 5: ['###', '## ', '###'],
  6: [' ##', '###', ' ##'], 7: ['###', '  #', '  #'], 8: [' # ', '###', ' # '],
  9: [' # ', ' ##', ' # '],
  ' ': ['   ', '   ', '   '], '!': [' # ', ' # ', ' # '], '?': ['## ', ' # ', ' # '],
  '.': ['   ', '   ', ' # ']
};

function renderAscii(text) {
  const chars = text.toUpperCase().split('');
  const rows = ['', '', ''];
  for (const ch of chars) {
    const glyph = FONT[ch] || ['   ', '   ', '   '];
    for (let r = 0; r < 3; r++) rows[r] += glyph[r] + ' ';
  }
  return rows.join('\n');
}

function compute({ text }) {
  const value = typeof text === 'string' ? text : '';
  const trimmed = value.slice(0, 20);
  const output = trimmed ? renderAscii(trimmed) : '';
  return { output };
}

export default createComputeHandler(compute);
