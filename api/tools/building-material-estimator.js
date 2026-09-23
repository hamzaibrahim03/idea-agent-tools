import { createComputeHandler } from '../_lib/computeHandler.js';

const MATERIAL_RATES = [
  { name: 'Concrete (foundation & slab)', unit: 'cu yd', perSqFt: 0.045 },
  { name: 'Structural steel / rebar', unit: 'lb', perSqFt: 4 },
  { name: 'Bricks (if brick veneer)', unit: 'bricks', perSqFt: 7 },
  { name: 'Lumber (framing)', unit: 'board ft', perSqFt: 6 },
  { name: 'Drywall', unit: 'sq ft', perSqFt: 2.8 },
  { name: 'Roofing material', unit: 'sq ft', perSqFt: 0.45 },
  { name: 'Paint', unit: 'gallons', perSqFt: 0.02 }
];

function compute({ floorArea, floors }) {
  const areaNum = Number(floorArea);
  const floorsNum = Number(floors);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(floorsNum) && floorsNum > 0;
  const totalArea = valid ? areaNum * floorsNum : 0;
  const materials = valid
    ? MATERIAL_RATES.map((m) => ({ name: m.name, unit: m.unit, quantity: m.perSqFt * totalArea }))
    : [];
  return { valid, totalArea, materials };
}

export default createComputeHandler(compute);
