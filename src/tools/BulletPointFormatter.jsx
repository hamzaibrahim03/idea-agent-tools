import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function toRoman(num) {
  const table = [
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
  ];
  let n = num;
  let result = '';
  for (const [value, symbol] of table) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}
function toLetters(num) {
  let n = num;
  let result = '';
  while (n > 0) {
    n--;
    result = String.fromCharCode(97 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}
const STYLES = {
  bullet: () => '• ',
  dash: () => '- ',
  asterisk: () => '* ',
  numbered: (i) => `${i}. `,
  lettered: (i) => `${toLetters(i)}. `,
  roman: (i) => `${toRoman(i)}. `
};
const STYLE_LABELS = {
  bullet: 'Bullet (•)',
  dash: 'Dash (-)',
  asterisk: 'Asterisk (*)',
  numbered: 'Numbered (1.)',
  lettered: 'Lettered (a.)',
  roman: 'Roman numeral (i.)'
};
function formatBullets(text, style) {
  const prefixFn = STYLES[style];
  let count = 0;
  return text
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return line;
      count++;
      return `${prefixFn(count)}${line}`;
    })
    .join('\n');
}
export default function BulletPointFormatter() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('bullet');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = useMemo(() => formatBullets(input, style), [input, style]);
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
    downloadFile(output, 'bullet-points.txt', 'text/plain');
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
      <h1>Bullet Point Formatter</h1>
      <p className="tool-description">
        Paste lines of text and add a bullet, dash, asterisk, or numbered/lettered/roman-numeral
        prefix to each non-empty line. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Style:
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {Object.entries(STYLE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
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
          <label htmlFor="bp-input">Input</label>
          <textarea id="bp-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder={'First item\nSecond item\nThird item'} />
        </div>
        <div className="tool-panel">
          <label htmlFor="bp-output">Formatted output</label>
          <textarea id="bp-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
