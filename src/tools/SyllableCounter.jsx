import { useMemo, useRef, useState } from 'react';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  const groups = clean.match(/[aeiouy]+/g) || [];
  let count = groups.length;
  if (clean.endsWith('e') && !clean.endsWith('le')) {
    count -= 1;
  } else if (clean.endsWith('le') && clean.length > 2 && !/[aeiouy]/.test(clean[clean.length - 3])) {
    count += 1;
  }
  if (clean.endsWith('ed') && groups.length > 1) {
    const beforeEd = clean.slice(0, -2);
    if (!/[td]$/.test(beforeEd)) count -= 1;
  }
  return Math.max(1, count);
}
function analyze(text) {
  const words = text.match(/[a-zA-Z']+/g) || [];
  const perWord = words.map((w) => ({ word: w, syllables: countSyllables(w) }));
  const total = perWord.reduce((sum, w) => sum + w.syllables, 0);
  return { perWord, total, wordCount: words.length };
}
export default function SyllableCounter() {
  const [input, setInput] = useState('');
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const { perWord, total, wordCount } = useMemo(() => analyze(input), [input]);
  function handleUploadClick() {
    fileInputRef.current?.click();
  }
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setInput(await readFileAsText(file));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  async function handleLoadFromUrl() {
    const url = window.prompt('Enter a URL to load text from:');
    if (!url) return;
    try {
      setInput(await loadTextFromUrl(url));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  return (
    <div className="tool-page">
      <h1>Syllable Counter</h1>
      <p className="tool-description">
        Estimate the syllable count for each word and the total, using a vowel-group heuristic with
        common English adjustments (like silent trailing "e"). This is a heuristic estimate, not a
        linguistically perfect count - handy for haiku and other syllable-counted poetry. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="syllable-input">Text</label>
        <textarea
          id="syllable-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here, e.g. an old silent pond"
        />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleUploadClick}>
          Upload file
        </button>
        <button type="button" onClick={handleLoadFromUrl}>
          Load from URL
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,text/*"
          style={{ display: 'none' }}
        />
      </div>
      {loadError && (
        <div className="tool-error">
          <strong>Load error:</strong> {loadError}
        </div>
      )}
      {wordCount > 0 && (
        <div className="timestamp-result">
          <span>
            <strong>Total syllables (estimated):</strong> {total}
          </span>
          <span>
            <strong>Words:</strong> {wordCount}
          </span>
        </div>
      )}
      {perWord.length > 0 && (
        <div className="tool-panel">
          <label>Per-word breakdown</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Syllables</th>
                </tr>
              </thead>
              <tbody>
                {perWord.map((w, i) => (
                  <tr key={`${w.word}-${i}`}>
                    <td>{w.word}</td>
                    <td>{w.syllables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
