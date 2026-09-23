import { createComputeHandler } from '../_lib/computeHandler.js';

const UUID_RE = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;

function variantLabel(digit) {
  const bits = parseInt(digit, 16);
  if ((bits & 0b1000) === 0b0000) return 'NCS backward compatible (0xx)';
  if ((bits & 0b1100) === 0b1000) return 'RFC 4122 (10x)';
  if ((bits & 0b1110) === 0b1100) return 'Microsoft (110)';
  return 'Reserved for future use (111)';
}

function analyzeUuid(input) {
  const trimmed = input.trim();
  const match = trimmed.match(UUID_RE);
  if (!match) {
    return { valid: false, formatOk: false };
  }
  const [, g1, g2, g3, g4, g5] = match;
  const version = g3[0];
  const variantDigit = g4[0];
  const isNilUuid = /^0+$/.test(g1 + g2 + g3 + g4 + g5);
  const isMaxUuid = /^f+$/i.test(g1 + g2 + g3 + g4 + g5);
  return {
    valid: true,
    formatOk: true,
    canonical: `${g1}-${g2}-${g3}-${g4}-${g5}`.toLowerCase(),
    version: /[1-8]/.test(version) ? version : null,
    versionRaw: version,
    variant: variantLabel(variantDigit),
    isNilUuid,
    isMaxUuid
  };
}

function compute({ input }) {
  const value = String(input || '').trim();
  if (!value) return { result: null };
  return { result: analyzeUuid(value) };
}

export default createComputeHandler(compute);
