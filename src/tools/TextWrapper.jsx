import { useMemo, useState } from 'react';
function wrapText(text, width) {
  if (width < 1) return text;
  return text
    .split('\n')
    .map((line) => wrapLine(line, width))
    .join('\n');
}
function wrapLine(line, width) {
  if (line.length === 0) return '';
  const words = line.split(' ');
  const outputLines = [];
  let current = '';
  for (const word of words) {
    if (word.length > width) {
      if (current) {
        outputLines.push(current);
        current = '';
      }
      let remaining = word;
      while (remaining.length > width) {
        outputLines.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      current = remaining;
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width) {
      outputLines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) outputLines.push(current);
  return outputLines.join('\n');
}
export default function TextWrapper() {
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(80);
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => wrapText(input, width), [input, width]);
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Text Wrapper</h1>
      <p className="tool-description">
        Wrap plain text to a fixed line width, breaking on word boundaries. Only words longer than
        the wrap width itself get broken mid-word. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Wrap width:
          <input
            type="number"
            min="1"
            max="500"
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="wrap-input">Input</label>
          <textarea
            id="wrap-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="wrap-output">Wrapped output</label>
          <textarea id="wrap-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
