import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const AP_MAX_MINOR_LENGTH = 3;
const AP_ALWAYS_CAPITALIZE = new Set(['is', 'are', 'be', 'if']);
const CHICAGO_MINOR_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
  'as', 'at', 'by', 'in', 'of', 'on', 'per', 'to', 'up', 'via', 'from', 'into', 'onto', 'with'
]);
function capitalizeWord(word) {
  const lower = word.toLowerCase();
  const firstLetterIdx = lower.search(/[a-z0-9]/);
  if (firstLetterIdx === -1) return word;
  return lower.slice(0, firstLetterIdx) + lower[firstLetterIdx].toUpperCase() + lower.slice(firstLetterIdx + 1);
}
function isMinorWord(word, style) {
  const bare = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!bare) return false;
  if (style === 'chicago') {
    return CHICAGO_MINOR_WORDS.has(bare);
  }
  return bare.length <= AP_MAX_MINOR_LENGTH && !AP_ALWAYS_CAPITALIZE.has(bare);
}
function toTitleCase(text, style) {
  return text
    .split('\n')
    .map((line) => {
      const words = line.split(/(\s+)/);
      const wordIndices = words.map((w, i) => (w.trim() ? i : -1)).filter((i) => i !== -1);
      const lastWordIdx = wordIndices[wordIndices.length - 1];
      const firstWordIdx = wordIndices[0];
      return words
        .map((word, i) => {
          if (!word.trim()) return word;
          const isEdge = i === firstWordIdx || i === lastWordIdx;
          if (!isEdge && isMinorWord(word, style)) {
            return word.toLowerCase();
          }
          return capitalizeWord(word);
        })
        .join('');
    })
    .join('\n');
}
export default function TitleCaseConverter() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('ap');
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => toTitleCase(input, style), [input, style]);
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
    downloadFile(output, 'title-case.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Title Case Converter</h1>
      <p className="tool-description">
        Convert text to proper title case following standard style-guide rules: major words are
        capitalized, while minor words (articles, short conjunctions, short prepositions) stay
        lowercase unless they are the first or last word. Choose between AP style (short words of
        3 letters or fewer stay lowercase) and Chicago style (a fixed list of minor words). Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Style:
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="ap">AP style</option>
            <option value="chicago">Chicago style</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="tc-input">Input</label>
          <textarea id="tc-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="the quick brown fox jumps over the lazy dog" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-output">Title case output</label>
          <textarea id="tc-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
