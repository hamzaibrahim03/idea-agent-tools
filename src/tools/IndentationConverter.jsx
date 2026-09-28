import { useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function expandLeadingTabs(line, tabWidth) {
  let result = '';
  let column = 0;
  let i = 0;
  while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
    if (line[i] === '\t') {
      const spaces = tabWidth - (column % tabWidth);
      result += ' '.repeat(spaces);
      column += spaces;
    } else {
      result += ' ';
      column += 1;
    }
    i++;
  }
  return result + line.slice(i);
}
function convertIndentation(code, mode, spaceWidth, tabWidth) {
  return code
    .split('\n')
    .map((line) => {
      const expanded = expandLeadingTabs(line, tabWidth);
      const leadingSpaces = expanded.match(/^ */)[0].length;
      const rest = expanded.slice(leadingSpaces);
      const levels = Math.floor(leadingSpaces / spaceWidth);
      const remainder = leadingSpaces % spaceWidth;
      if (mode === 'tabs') {
        return '\t'.repeat(levels) + ' '.repeat(remainder) + rest;
      }
      return ' '.repeat(leadingSpaces) + rest;
    })
    .join('\n');
}
export default function IndentationConverter() {
  const [input, setInput] = useState('function greet() {\n\tif (true) {\n\t\tconsole.log("hi");\n\t}\n}');
  const [mode, setMode] = useState('spaces');
  const [width, setWidth] = useState(2);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = input ? convertIndentation(input, mode, width, width) : '';
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
    downloadFile(output, 'converted-indentation.txt', 'text/plain');
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
    const url = window.prompt('Enter a URL to load code from:');
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
      <h1>Indentation Converter</h1>
      <p className="tool-description">
        Convert code indentation between tabs and spaces, or change the space width. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Convert to:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="spaces">Spaces</option>
            <option value="tabs">Tabs</option>
          </select>
        </label>
        <label>
          Indent width:
          <input
            type="number"
            min={1}
            max={8}
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: '60px' }}
          />
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
          accept=".js,.jsx,.ts,.tsx,.py,.txt,text/*"
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
          <label htmlFor="indent-input">Input</label>
          <textarea id="indent-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="indent-output">Output</label>
          <textarea id="indent-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
