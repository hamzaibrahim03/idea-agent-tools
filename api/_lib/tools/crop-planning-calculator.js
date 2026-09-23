import { createComputeHandler } from '../computeHandler.js';

const AREA_UNITS = {
  acres: { label: 'Acres', sqft: 43560 },
  hectares: { label: 'Hectares', sqft: 107639.1 },
  sqft: { label: 'Square feet', sqft: 1 },
  sqm: { label: 'Square meters', sqft: 10.7639 }
};

function compute({ area, areaUnit, rowSpacingIn, plantSpacingIn }) {
  const areaNum = Number(area);
  const rowSpacing = Number(rowSpacingIn);
  const plantSpacing = Number(plantSpacingIn);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(rowSpacing) && rowSpacing > 0 &&
    Number.isFinite(plantSpacing) && plantSpacing > 0;
  if (!valid) {
    return { valid: false };
  }
  const areaSqFt = areaNum * AREA_UNITS[areaUnit].sqft;
  const areaSqIn = areaSqFt * 144;
  const spacePerPlantSqIn = rowSpacing * plantSpacing;
  const plantCount = Math.floor(areaSqIn / spacePerPlantSqIn);
  return { valid: true, areaSqFt, plantCount };
}

export default createComputeHandler(compute);
