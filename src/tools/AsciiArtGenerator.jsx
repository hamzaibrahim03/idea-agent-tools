import { useState } from 'react';
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
export default function AsciiArtGenerator() {
  const [text, setText] = useState('HELLO');
  const [copied, setCopied] = useState(false);
  const trimmed = text.slice(0, 20);
  const output = trimmed ? renderAscii(trimmed) : '';
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Text to ASCII Art</h1>
      <p className="tool-description">
        Convert short text into blocky ASCII art banner text (letters, digits, and a few
        punctuation marks; limited to 20 characters). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={20} style={{ width: '200px' }} />
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="regex-highlighted" style={{ fontSize: 14, lineHeight: 1.4 }}>
        {output || 'Type something above'}
      </pre>
    </div>
  );
}
