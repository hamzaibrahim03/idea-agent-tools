import { useState, useMemo } from 'react';
function buildCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = buildCrcTable();
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export default function Crc32Calculator() {
  const [input, setInput] = useState('123456789');
  const [copied, setCopied] = useState(false);
  const checksum = useMemo(() => {
    const bytes = new TextEncoder().encode(input);
    return crc32(bytes);
  }, [input]);
  const hex = checksum.toString(16).padStart(8, '0').toUpperCase();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>CRC-32 Calculator</h1>
      <p className="tool-description">
        Compute the CRC-32 (IEEE 802.3) checksum of text, the same algorithm used by ZIP, PNG,
        and Ethernet. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy checksum'}</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="crc-input">Text</label>
        <textarea
          id="crc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text"
          spellCheck={false}
        />
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="crc-hex">CRC-32 (hex)</label>
          <input id="crc-hex" type="text" value={hex} readOnly style={{ fontFamily: 'var(--mono)' }} />
        </div>
        <div className="tool-panel">
          <label htmlFor="crc-dec">CRC-32 (decimal)</label>
          <input id="crc-dec" type="text" value={checksum} readOnly style={{ fontFamily: 'var(--mono)' }} />
        </div>
      </div>
    </div>
  );
}
