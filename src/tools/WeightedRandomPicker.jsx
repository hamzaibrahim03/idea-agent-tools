import { useRef, useState } from 'react';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function randomFloat01() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}
function parseOptions(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const commaIdx = line.lastIndexOf(',');
      if (commaIdx === -1) return { label: line, weight: 1 };
      const label = line.slice(0, commaIdx).trim();
      const weightStr = line.slice(commaIdx + 1).trim();
      const weight = Number(weightStr);
      if (!label || Number.isNaN(weight) || weight <= 0) return { label: line, weight: 1 };
      return { label, weight };
    });
}
function pickWeighted(options) {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let roll = randomFloat01() * totalWeight;
  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) return option;
  }
  return options[options.length - 1];
}
export default function WeightedRandomPicker() {
  const [input, setInput] = useState('Pizza, 5\nSushi, 3\nTacos, 2\nSalad, 1');
  const [result, setResult] = useState(null);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const options = parseOptions(input);
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  function handlePick() {
    if (options.length === 0) return;
    setResult(pickWeighted(options));
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
      <h1>Weighted Random Picker</h1>
      <p className="tool-description">
        Enter options with relative weights (one per line, as "Option, weight") and pick one at
        random using your browser's cryptographically-random source, respecting the weights. An
        option with weight 3 is three times as likely to be picked as one with weight 1. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="weighted-options-input">Options (one per line, "label, weight")</label>
        <textarea
          id="weighted-options-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="tool-controls">
        <button onClick={handlePick} disabled={options.length === 0}>
          Pick at random
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
      {options.length === 0 && <div className="tool-error">Add at least one option above.</div>}
      {options.length > 0 && (
        <ul className="uuid-list">
          {options.map((o, i) => (
            <li key={i}>
              <span>{o.label}</span>
              <code>
                weight {o.weight} ({((o.weight / totalWeight) * 100).toFixed(1)}%)
              </code>
            </li>
          ))}
        </ul>
      )}
      {result && (
        <div className="timestamp-result" style={{ marginTop: 16 }}>
          <strong>Picked:</strong> {result.label}
        </div>
      )}
    </div>
  );
}
