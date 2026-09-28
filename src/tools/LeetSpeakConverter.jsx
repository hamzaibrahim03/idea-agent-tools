import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
const LIGHT_MAP = {
  a: '4', e: '3', i: '1', o: '0', s: '5', t: '7'
};
const AGGRESSIVE_MAP = {
  ...LIGHT_MAP,
  b: '8', g: '9', l: '1', z: '2'
};
function convert(text, map) {
  return [...text]
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (!(lower in map)) return ch;
      return map[lower];
    })
    .join('');
}
export default function LeetSpeakConverter() {
  const [input, setInput] = useState('');
  const [intensity, setIntensity] = useState('light');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = useMemo(
    () => convert(input, intensity === 'aggressive' ? AGGRESSIVE_MAP : LIGHT_MAP),
    [input, intensity]
  );
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
    downloadFile(output, 'leet-speak.txt', 'text/plain');
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
      <h1>Leet Speak Converter</h1>
      <p className="tool-description">
        Convert text into "leet speak" (1337) using common character substitutions like a-&gt;4,
        e-&gt;3, i-&gt;1, o-&gt;0, s-&gt;5, and t-&gt;7. Choose a light level for just the classic,
        easy-to-read swaps, or aggressive for more letters replaced. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Intensity:
          <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
            <option value="light">Light (a, e, i, o, s, t)</option>
            <option value="aggressive">Aggressive (+ b, g, l, z)</option>
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
          <label htmlFor="leet-input">Text</label>
          <textarea
            id="leet-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="leet-output">Leet speak</label>
          <textarea id="leet-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
