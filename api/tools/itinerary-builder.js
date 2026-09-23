import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ entries }) {
  const list = Array.isArray(entries) ? entries : [];
  const sorted = [...list].sort((a, b) => (Number(a.day) - Number(b.day)) || String(a.time).localeCompare(String(b.time)));
  const grouped = sorted.reduce((acc, entry) => {
    const key = String(entry.day);
    (acc[key] ||= []).push(entry);
    return acc;
  }, {});
  return { grouped };
}

export default createComputeHandler(compute);
