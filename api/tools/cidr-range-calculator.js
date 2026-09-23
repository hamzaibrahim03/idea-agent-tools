import { createComputeHandler } from '../_lib/computeHandler.js';

const PAGE_SIZE = 32;
const LISTABLE_PREFIX_THRESHOLD = 28;

function parseIp(str) {
  const parts = str.trim().split('.');
  if (parts.length !== 4) throw new Error('IP address must have 4 octets, e.g. 10.0.0.0.');
  const octets = parts.map((p) => {
    if (!/^\d{1,3}$/.test(p)) throw new Error(`Invalid octet "${p}" - must be a number.`);
    const n = Number(p);
    if (n < 0 || n > 255) throw new Error(`Octet ${n} out of range - must be 0-255.`);
    return n;
  });
  return octets;
}
function octetsToInt(octets) {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}
function intToOctets(int) {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}
function parseCidr(input) {
  const [ipPart, cidrPart] = input.split('/');
  if (!cidrPart) throw new Error('Enter a CIDR block, e.g. 10.0.0.0/24.');
  const cidr = Number(cidrPart);
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR prefix must be an integer between 0 and 32.');
  }
  const octets = parseIp(ipPart);
  const ipInt = octetsToInt(octets);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const totalAddresses = 2 ** (32 - cidr);
  const lastInt = (networkInt + totalAddresses - 1) >>> 0;
  return { cidr, networkInt, lastInt, totalAddresses };
}

function compute({ input, page }) {
  const text = input || '';
  const result = parseCidr(text);
  const isListable = result.cidr >= LISTABLE_PREFIX_THRESHOLD;
  const totalPages = Math.ceil(result.totalAddresses / PAGE_SIZE);
  const requestedPage = Number.isInteger(page) ? page : 0;
  const clampedPage = Math.min(requestedPage, Math.max(0, totalPages - 1));
  const pageAddresses = isListable
    ? Array.from({ length: Math.min(PAGE_SIZE, result.totalAddresses - clampedPage * PAGE_SIZE) }, (_, i) =>
        intToOctets((result.networkInt + clampedPage * PAGE_SIZE + i) >>> 0)
      )
    : [];
  return {
    cidr: result.cidr,
    firstAddress: intToOctets(result.networkInt),
    lastAddress: intToOctets(result.lastInt),
    totalAddresses: result.totalAddresses,
    isListable,
    totalPages,
    clampedPage,
    pageAddresses
  };
}

export default createComputeHandler(compute);
