import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ input }) {
  const text = String(input || '');
  const byteLength = new TextEncoder().encode(text).length;
  const output = toHexDump(text);
  return { output, byteLength };
}

export default createComputeHandler(compute);
