import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ roomLength, roomWidth, tileUnit, tileLength, tileWidth, waste, boxCoverage }) {
  const roomLengthNum = Number(roomLength);
  const roomWidthNum = Number(roomWidth);
  const tileLengthNum = Number(tileLength);
  const tileWidthNum = Number(tileWidth);
  const wasteNum = Number(waste);
  const boxCoverageNum = Number(boxCoverage);
  const valid =
    Number.isFinite(roomLengthNum) && roomLengthNum > 0 &&
    Number.isFinite(roomWidthNum) && roomWidthNum > 0 &&
    Number.isFinite(tileLengthNum) && tileLengthNum > 0 &&
    Number.isFinite(tileWidthNum) && tileWidthNum > 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  if (!valid) {
    throw new Error('Enter positive room and tile dimensions, and a non-negative waste percentage.');
  }
  const roomAreaSqFt = roomLengthNum * roomWidthNum;
  const tileAreaSqFt =
    tileUnit === 'in'
      ? (tileLengthNum / 12) * (tileWidthNum / 12)
      : tileLengthNum * tileWidthNum;
  const rawTilesNeeded = tileAreaSqFt > 0 ? roomAreaSqFt / tileAreaSqFt : null;
  const tilesWithWaste = rawTilesNeeded !== null ? rawTilesNeeded * (1 + wasteNum / 100) : null;
  const boxesNeeded =
    tilesWithWaste !== null && Number.isFinite(boxCoverageNum) && boxCoverageNum > 0
      ? Math.ceil((tilesWithWaste * tileAreaSqFt) / boxCoverageNum)
      : null;
  return { valid, roomAreaSqFt, rawTilesNeeded, tilesWithWaste, boxesNeeded };
}

export default createComputeHandler(compute);
