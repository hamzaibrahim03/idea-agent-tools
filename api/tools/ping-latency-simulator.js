import { webcrypto } from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

const BASE_LATENCY_MS = {
  'US East': { 'US East': 1, 'US West': 60, 'EU West': 80, 'EU Central': 95, 'Asia Pacific (Tokyo)': 150, 'Asia Pacific (Singapore)': 220, 'South America': 110, Australia: 200 },
  'US West': { 'US West': 1, 'EU West': 140, 'EU Central': 150, 'Asia Pacific (Tokyo)': 100, 'Asia Pacific (Singapore)': 170, 'South America': 170, Australia: 140 },
  'EU West': { 'EU West': 1, 'EU Central': 15, 'Asia Pacific (Tokyo)': 230, 'Asia Pacific (Singapore)': 170, 'South America': 190, Australia: 260 },
  'EU Central': { 'EU Central': 1, 'Asia Pacific (Tokyo)': 240, 'Asia Pacific (Singapore)': 160, 'South America': 200, Australia: 270 },
  'Asia Pacific (Tokyo)': { 'Asia Pacific (Tokyo)': 1, 'Asia Pacific (Singapore)': 70, 'South America': 280, Australia: 105 },
  'Asia Pacific (Singapore)': { 'Asia Pacific (Singapore)': 1, 'South America': 320, Australia: 95 },
  'South America': { 'South America': 1, Australia: 320 },
  Australia: { Australia: 1 }
};

function lookupBase(a, b) {
  if (a === b) return BASE_LATENCY_MS[a][b];
  return BASE_LATENCY_MS[a]?.[b] ?? BASE_LATENCY_MS[b]?.[a];
}

function simulateSample(baseMs) {
  const jitterBytes = new Uint32Array(1);
  webcrypto.getRandomValues(jitterBytes);
  const jitterFraction = (jitterBytes[0] / 0xffffffff) * 0.3 - 0.05;
  return Math.max(1, Math.round(baseMs * (1 + jitterFraction)));
}

function compute({ regionA, regionB, simulate }) {
  const baseMs = lookupBase(regionA, regionB);
  if (!simulate) return { baseMs };
  const samples = Array.from({ length: 5 }, () => simulateSample(baseMs));
  return { baseMs, samples };
}

export default createComputeHandler(compute);
