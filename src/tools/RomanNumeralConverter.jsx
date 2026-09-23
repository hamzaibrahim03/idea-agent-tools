import { useState } from 'react';
const VALUES = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];
const ROMAN_PATTERN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
function toRoman(num) {
  let result = '';
  let remaining = num;
  for (const [value, symbol] of VALUES) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
function fromRoman(str) {
  let result = 0;
  let i = 0;
  for (const [value, symbol] of VALUES) {
    while (str.slice(i, i + symbol.length) === symbol) {
      result += value;
      i += symbol.length;
    }
  }
  return result;
}
function looksLikeRoman(str) {
  return /^[IVXLCDM]+$/i.test(str.trim());
}
export default function RomanNumeralConverter() {
  const [input, setInput] = useState('');
  const trimmed = input.trim();
  let output = '';
  let error = '';
  if (trimmed) {
    if (looksLikeRoman(trimmed)) {
      const upper = trimmed.toUpperCase();
      if (!ROMAN_PATTERN.test(upper) || !upper.length) {
        error = `"${trimmed}" is not a valid Roman numeral.`;
      } else {
        output = String(fromRoman(upper));
      }
    } else if (/^-?\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      if (num < 1 || num > 3999) {
        error = 'Enter a whole number between 1 and 3999.';
      } else {
        output = toRoman(num);
      }
    } else {
      error = `"${trimmed}" is not a valid number or Roman numeral.`;
    }
  }
  return (
    <div className="tool-page">
      <h1>Roman Numeral Converter</h1>
      <p className="tool-description">
        Convert between Arabic numbers (1-3999) and Roman numerals, in either direction. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="roman-input">Number or Roman numeral</label>
        <input
          id="roman-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1994 or MCMXCIV"
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {output && !error && (
        <div className="tool-panel">
          <label htmlFor="roman-output">Result</label>
          <input id="roman-output" type="text" value={output} readOnly style={{ fontFamily: 'var(--mono)' }} />
        </div>
      )}
    </div>
  );
}
