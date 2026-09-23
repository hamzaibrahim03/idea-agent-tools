import { useMemo, useState } from 'react';
const BYTES_PER_ROW = 16;
function toHexDump(text) {
  const bytes = new TextEncoder().encode(text);
  if (bytes.length === 0) return '';
  const rows = [];
  for (let offset = 0; offset < bytes.length; offset += BYTES_PER_ROW) {
    const chunk = bytes.slice(offset, offset + BYTES_PER_ROW);
    const hex = Array.from(chunk, (b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(BYTES_PER_ROW * 3 - 1, ' ');
    const ascii = Array.from(chunk, (b) => (b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.')).join('');
    rows.push(`${offset.toString(16).padStart(8, '0')}  ${hex}  |${ascii}|`);
  }
  return rows.join('\n');
}
export default function TextToHexDump() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const byteLength = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const output = useMemo(() => toHexDump(input), [input]);
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
      <h1>Text to Hex Dump</h1>
      <p className="tool-description">
        Paste text to see a classic hex dump: byte offset, hexadecimal bytes, and their printable
        ASCII representation, 16 bytes per row, using UTF-8 byte encoding. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <span className="tool-placeholder">{byteLength} byte{byteLength === 1 ? '' : 's'} (UTF-8)</span>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy hex dump'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="hex-input">Input</label>
        <textarea id="hex-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste or type text here" />
      </div>
      {output && (
        <div className="tool-panel">
          <label>Hex dump</label>
          <pre className="regex-highlighted">{output}</pre>
        </div>
      )}
    </div>
  );
}
