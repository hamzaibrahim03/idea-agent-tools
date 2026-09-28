import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
const VOWELS =new Set(['a', 'e', 'i', 'o', 'u']);
function translateWord(word) {
  const leading = word.match(/^[a-zA-Z]+/);
  if (!leading) return word;
  const core = leading[0];
  const rest = word.slice(core.length);
  const firstChar = core[0];
  const isUpperFirst = firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
  const lower = core.toLowerCase();
  if (VOWELS.has(lower[0])) {
    const translated = lower + 'way';
    return (isUpperFirst ? capitalize(translated) : translated) + rest;
  }
  let splitIndex = 0;
  while (splitIndex < lower.length && !VOWELS.has(lower[splitIndex])) {
    if (lower[splitIndex] === 'q' && lower[splitIndex + 1] === 'u') {
      splitIndex += 2;
      continue;
    }
    splitIndex++;
  }
  if (splitIndex === 0 || splitIndex >= lower.length) {
    const translated = lower + 'ay';
    return (isUpperFirst ? capitalize(translated) : translated) + rest;
  }
  const translated = lower.slice(splitIndex) + lower.slice(0, splitIndex) + 'ay';
  return (isUpperFirst ? capitalize(translated) : translated) + rest;
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function translateText(text) {
  return text.replace(/[a-zA-Z]+/g, translateWord);
}
export default function PigLatinTranslator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = useMemo(() => translateText(input), [input]);
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
    downloadFile(output, 'pig-latin.txt', 'text/plain');
  }
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
      <h1>Pig Latin Translator</h1>
      <p className="tool-description">
        Translate English text to Pig Latin: consonant clusters move to the end of the word plus
        "ay", and words that start with a vowel get "way" appended. This is one-directional -
        translating Pig Latin back to reliable English isn't possible. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
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
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pig-input">English text</label>
          <textarea
            id="pig-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste English text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="pig-output">Pig Latin</label>
          <textarea id="pig-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
