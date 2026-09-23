import { createComputeHandler } from '../computeHandler.js';

const DRY_VOLUME_FACTOR = 1.54;
const CEMENT_DENSITY_KG_M3 = 1440;
const CEMENT_BAG_KG = 50;
const MIX_RATIOS = {
  '1:1.5:3': { cement: 1, sand: 1.5, aggregate: 3, label: '1:1.5:3 (M20, structural)' },
  '1:2:4': { cement: 1, sand: 2, aggregate: 4, label: '1:2:4 (M15, general RCC)' },
  '1:3:6': { cement: 1, sand: 3, aggregate: 6, label: '1:3:6 (M10, mass concrete)' },
  '1:4:8': { cement: 1, sand: 4, aggregate: 8, label: '1:4:8 (PCC, leveling/foundation)' }
};

function compute({ area, thickness, ratioKey, steelDensity }) {
  const areaNum = Number(area);
  const thicknessNum = Number(thickness);
  const steelDensityNum = Number(steelDensity);
  const ratio = MIX_RATIOS[ratioKey] || MIX_RATIOS['1:2:4'];
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(thicknessNum) && thicknessNum > 0 &&
    Number.isFinite(steelDensityNum) && steelDensityNum >= 0;
  if (!valid) {
    throw new Error('Enter a positive area, positive thickness, and non-negative steel density.');
  }
  const wetVolumeM3 = areaNum * (thicknessNum / 1000);
  const dryVolumeM3 = wetVolumeM3 * DRY_VOLUME_FACTOR;
  const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
  const cementVolumeM3 = (dryVolumeM3 * ratio.cement) / totalParts;
  const sandVolumeM3 = (dryVolumeM3 * ratio.sand) / totalParts;
  const aggregateVolumeM3 = (dryVolumeM3 * ratio.aggregate) / totalParts;
  const cementKg = cementVolumeM3 * CEMENT_DENSITY_KG_M3;
  const cementBags = cementKg / CEMENT_BAG_KG;
  const steelKg = areaNum * steelDensityNum;
  return { wetVolumeM3, dryVolumeM3, cementVolumeM3, sandVolumeM3, aggregateVolumeM3, cementBags, steelKg };
}

export default createComputeHandler(compute);
