import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris ' +
  'nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse ' +
  'cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa ' +
  'qui officia deserunt mollit anim id est laborum'
).split(' ');
function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
function makeSentence() {
  const length = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length }, randomWord);
  const sentence = words.join(' ');
  return sentence[0].toUpperCase() + sentence.slice(1) + '.';
}
function makeParagraph(sentenceCount) {
  return Array.from({ length: sentenceCount }, makeSentence).join(' ');
}
export default function LoremIpsumGenerator() {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState(() => generate(3, true));
  const [copied, setCopied] = useState(false);
  function generate(count, classic) {
    const paragraphs = Array.from({ length: count }, () => makeParagraph(4 + Math.floor(Math.random() * 3)));
    if (classic && paragraphs.length > 0) {
      paragraphs[0] =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        paragraphs[0];
    }
    return paragraphs.join('\n\n');
  }
  function handleGenerate() {
    setOutput(generate(Math.max(1, Math.min(20, Number(paragraphCount) || 1)), startClassic));
    setCopied(false);
  }
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
    downloadFile(output, 'lorem-ipsum.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Lorem Ipsum Generator</h1>
      <p className="tool-description">
        Generate placeholder Lorem Ipsum text for mockups and layouts. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Paragraphs:
          <input
            type="number"
            min={1}
            max={20}
            value={paragraphCount}
            onChange={(e) => setParagraphCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={startClassic} onChange={(e) => setStartClassic(e.target.checked)} />
          Start with classic opening
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-panel">
        <textarea readOnly value={output} style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}
