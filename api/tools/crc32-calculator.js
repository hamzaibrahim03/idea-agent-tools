import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ input }) {
  const bytes = new TextEncoder().encode(input || '');
  const checksum = crc32(bytes);
  const hex = checksum.toString(16).padStart(8, '0').toUpperCase();
  return { checksum, hex };
}

export default createComputeHandler(compute);
