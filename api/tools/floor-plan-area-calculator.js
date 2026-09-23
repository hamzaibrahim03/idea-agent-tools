import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ rooms }) {
  const list = Array.isArray(rooms) ? rooms : [];
  const rows = list.map((r) => {
    const l = Number(r.length);
    const w = Number(r.width);
    const valid = Number.isFinite(l) && l > 0 && Number.isFinite(w) && w > 0;
    return { ...r, area: valid ? l * w : null };
  });
  const totalArea = rows.reduce((sum, r) => sum + (r.area || 0), 0);
  return { rows, totalArea, roomCount: rows.filter((r) => r.area !== null).length };
}

export default createComputeHandler(compute);
