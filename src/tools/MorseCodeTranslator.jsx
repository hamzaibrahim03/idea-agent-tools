import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const MORSE_TABLE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};
const MORSE_TO_CHAR = Object.fromEntries(Object.entries(MORSE_TABLE).map(([k, v]) => [v, k]));
function textToMorse(text) {
  return text
    .toUpperCase()
    .split(' ')
    .map((word) =>
      [...word]
        .map((ch) => MORSE_TABLE[ch] ?? '')
        .filter(Boolean)
        .join(' ')
    )
    .filter(Boolean)
    .join(' / ');
}
function morseToText(morse) {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_TO_CHAR[code] ?? '')
        .join('')
    )
    .join(' ');
}
function looksLikeMorse(str) {
  return /^[.\-/\s]+$/.test(str.trim()) && /[.-]/.test(str);
}
export default function MorseCodeTranslator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const direction = looksLikeMorse(input) ? 'toMorse' : 'toText';
  const output = !input.trim() ? '' : direction === 'toMorse' ? morseToText(input) : textToMorse(input);
  const outputLabel = direction === 'toMorse' ? 'Text' : 'Morse code';
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'morse-code.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Morse Code Translator</h1>
      <p className="tool-description">
        Translate text to Morse code and back. Direction is auto-detected: type plain text to get
        Morse, or dots and dashes to get text back. Words are separated by " / " in Morse. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="morse-input">Text or Morse code</label>
          <textarea
            id="morse-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. HELLO WORLD or .... . .-.. .-.. ---"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="morse-output">{outputLabel}</label>
          <textarea id="morse-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
