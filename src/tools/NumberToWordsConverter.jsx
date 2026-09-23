import { useMemo, useState } from 'react';
const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', ' thousand', ' million', ' billion'];
const MAX_VALUE = 999999999999;
function threeDigitsToWords(n) {
  const parts = [];
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds > 0) parts.push(`${ONES[hundreds]} hundred`);
  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      parts.push(ones > 0 ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
    }
  }
  return parts.join(' ');
}
function numberToWords(value) {
  if (!Number.isInteger(value)) return null;
  if (value === 0) return 'zero';
  const negative = value < 0;
  let n = Math.abs(value);
  if (n > MAX_VALUE) return null;
  const groups = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const words = groups
    .map((group, i) => (group > 0 ? threeDigitsToWords(group) + SCALES[i] : ''))
    .filter(Boolean)
    .reverse()
    .join(' ');
  return (negative ? 'negative ' : '') + words;
}
export default function NumberToWordsConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { words, error } = useMemo(() => {
    if (input.trim() === '') return { words: '', error: '' };
    const num = Number(input);
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      return { words: '', error: 'Enter a whole number.' };
    }
    if (Math.abs(num) > MAX_VALUE) {
      return { words: '', error: `Number is too large. Max supported is ${MAX_VALUE.toLocaleString()}.` };
    }
    return { words: numberToWords(num), error: '' };
  }, [input]);
  async function handleCopy() {
    if (!words) return;
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Number to Words Converter</h1>
      <p className="tool-description">
        Convert a number into its English words form, e.g. 1234 becomes "one thousand two hundred
        thirty-four". Supports whole numbers up to 999,999,999,999. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!words}>
          {copied ? 'Copied!' : 'Copy words'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="n2w-input">Number</label>
        <input
          id="n2w-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1234"
        />
        {error && <span className="tool-error-inline">{error}</span>}
      </div>
      <div className="tool-panel">
        <label htmlFor="n2w-output">In words</label>
        <input id="n2w-output" type="text" value={words} readOnly />
      </div>
    </div>
  );
}
