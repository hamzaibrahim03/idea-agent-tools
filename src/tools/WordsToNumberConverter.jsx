import { useMemo, useState } from 'react';
const ONES = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19
};
const TENS = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
};
const SCALES = { hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 };
function wordsToNumber(text) {
  const cleaned = text
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\band\b/g, ' ')
    .replace(/,/g, ' ')
    .trim();
  if (!cleaned) return { value: null, error: '' };
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  let negative = false;
  let startIndex = 0;
  if (tokens[0] === 'negative' || tokens[0] === 'minus') {
    negative = true;
    startIndex = 1;
  }
  let total = 0;
  let current = 0;
  let matchedAny = false;
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];
    if (token in ONES) {
      current += ONES[token];
      matchedAny = true;
    } else if (token in TENS) {
      current += TENS[token];
      matchedAny = true;
    } else if (token === 'hundred') {
      current = (current || 1) * SCALES.hundred;
      matchedAny = true;
    } else if (token === 'thousand' || token === 'million' || token === 'billion') {
      current = (current || 1) * SCALES[token];
      total += current;
      current = 0;
      matchedAny = true;
    } else {
      return { value: null, error: `Could not parse "${token}" as a number word.` };
    }
  }
  total += current;
  if (!matchedAny) return { value: null, error: 'No recognizable number words found.' };
  return { value: negative ? -total : total, error: '' };
}
export default function WordsToNumberConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { value, error } = useMemo(() => {
    if (input.trim() === '') return { value: null, error: '' };
    return wordsToNumber(input);
  }, [input]);
  const output = value !== null ? String(value) : '';
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
      <h1>Words to Number Converter</h1>
      <p className="tool-description">
        Parse English number words back into a numeric value, e.g. "one thousand two hundred
        thirty four" becomes 1234. Handles common phrasing including hyphens and "and", but unusual
        or informal wording may not parse. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy number'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="w2n-input">Number in words</label>
        <input
          id="w2n-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. one thousand two hundred thirty four"
        />
        {error && <span className="tool-error-inline">{error}</span>}
      </div>
      <div className="tool-panel">
        <label htmlFor="w2n-output">Number</label>
        <input id="w2n-output" type="text" value={output} readOnly />
      </div>
    </div>
  );
}
