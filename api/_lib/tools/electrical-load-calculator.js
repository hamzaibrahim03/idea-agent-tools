import { createComputeHandler } from '../computeHandler.js';

function compute({ items, voltage }) {
  const rows = (items || []).map((it) => {
    const w = Number(it.watts);
    const q = Number(it.quantity);
    const valid = Number.isFinite(w) && w >= 0 && Number.isFinite(q) && q > 0;
    return { ...it, subtotal: valid ? w * q : null };
  });
  const totalWatts = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const voltageNum = Number(voltage);
  const voltageValid = Number.isFinite(voltageNum) && voltageNum > 0;
  const totalAmps = voltageValid ? totalWatts / voltageNum : null;
  return { rows, totalWatts, voltageValid, totalAmps };
}

export default createComputeHandler(compute);
