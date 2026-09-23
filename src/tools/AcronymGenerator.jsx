import { useMemo, useState } from 'react';
const SMALL_WORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'by', 'for', 'to', 'and', 'or', 'but', 'nor', 'with', 'as'
]);
function extractWords(phrase) {
  return phrase
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
}
function generateAcronym(phrase, excludeSmallWords) {
  const words = extractWords(phrase);
  const letters = words
    .filter((w) => !excludeSmallWords || !SMALL_WORDS.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase());
  const uppercase = letters.join('');
  const withPeriods = letters.length ? letters.join('.') + '.' : '';
  return { uppercase, withPeriods, wordCount: words.length };
}
export default function AcronymGenerator() {
  const [input, setInput] = useState('');
  const [excludeSmallWords, setExcludeSmallWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const { uppercase, withPeriods } = useMemo(
    () => generateAcronym(input, excludeSmallWords),
    [input, excludeSmallWords]
  );
  async function handleCopy() {
    if (!uppercase) return;
    try {
      await navigator.clipboard.writeText(uppercase);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Acronym Generator</h1>
      <p className="tool-description">
        Type a phrase and generate an acronym from the first letter of each word. Handles extra
        spaces, punctuation, and hyphenated words (each half of a hyphenated word counts as its own
        word). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={excludeSmallWords} onChange={() => setExcludeSmallWords((v) => !v)} />
          Exclude small words (a, the, of, and, ...)
        </label>
        <button onClick={handleCopy} disabled={!uppercase}>
          {copied ? 'Copied!' : 'Copy acronym'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="acronym-input">Phrase</label>
        <input id="acronym-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Random Access Memory" />
      </div>
      <div className="tool-panel">
        <label htmlFor="acronym-output">Acronym</label>
        <input id="acronym-output" type="text" value={uppercase} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
      <div className="tool-panel">
        <label htmlFor="acronym-output-periods">With periods</label>
        <input id="acronym-output-periods" type="text" value={withPeriods} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}
