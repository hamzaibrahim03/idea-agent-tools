import { useState } from 'react';
function cleanText(text) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .trim()
    )
    .filter((para) => para.length > 0);
  return paragraphs.join('\n\n');
}
export default function PlainTextFormatter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const output = input ? cleanText(input) : '';
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
      <h1>Plain Text Formatter</h1>
      <p className="tool-description">
        Paste text with messy line breaks and spacing - like text copied from a PDF with awkward
        line wraps - and clean it up: hard line breaks within a paragraph are removed while
        paragraph breaks (blank lines) are preserved, and extra whitespace is normalized. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>{copied ? 'Copied!' : 'Copy cleaned text'}</button>
        <button onClick={() => setInput('')} disabled={!input}>Clear</button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ptf-input">Input (messy text)</label>
          <textarea
            id="ptf-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with odd line wraps here"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="ptf-output">Output (cleaned)</label>
          <textarea id="ptf-output" value={output} readOnly spellCheck={false} placeholder="Cleaned text will appear here" />
        </div>
      </div>
    </div>
  );
}
