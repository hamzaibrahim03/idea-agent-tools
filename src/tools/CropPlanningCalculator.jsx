import { useState } from 'react';
const AREA_UNITS = {
  acres: { label: 'Acres', sqft: 43560 },
  hectares: { label: 'Hectares', sqft: 107639.1 },
  sqft: { label: 'Square feet', sqft: 1 },
  sqm: { label: 'Square meters', sqft: 10.7639 }
};
export default function CropPlanningCalculator() {
  const [area, setArea] = useState('1');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [rowSpacingIn, setRowSpacingIn] = useState('30');
  const [plantSpacingIn, setPlantSpacingIn] = useState('12');
  const areaNum = Number(area);
  const rowSpacing = Number(rowSpacingIn);
  const plantSpacing = Number(plantSpacingIn);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(rowSpacing) && rowSpacing > 0 &&
    Number.isFinite(plantSpacing) && plantSpacing > 0;
  let plantCount = null;
  let areaSqFt = null;
  if (valid) {
    areaSqFt = areaNum * AREA_UNITS[areaUnit].sqft;
    const areaSqIn = areaSqFt * 144;
    const spacePerPlantSqIn = rowSpacing * plantSpacing;
    plantCount = Math.floor(areaSqIn / spacePerPlantSqIn);
  }
  return (
    <div className="tool-page">
      <h1>Crop Planning Calculator</h1>
      <p className="tool-description">
        Enter your field area and desired row and plant spacing to estimate how many plants will fit.
        Uses simple area-divided-by-spacing math with consistent unit conversion. Actual plant counts
        may vary with field shape and headland space. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cpc-area">Field area</label>
          <input id="cpc-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="cpc-unit">Area unit</label>
          <select id="cpc-unit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
            {Object.entries(AREA_UNITS).map(([key, u]) => (
              <option key={key} value={key}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="cpc-row">Row spacing (inches)</label>
          <input id="cpc-row" type="number" min={0} value={rowSpacingIn} onChange={(e) => setRowSpacingIn(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="cpc-plant">Plant spacing within row (inches)</label>
          <input id="cpc-plant" type="number" min={0} value={plantSpacingIn} onChange={(e) => setPlantSpacingIn(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive field area and positive row and plant spacing.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Field area:</strong> {areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
          </div>
          <div>
            <strong>Estimated number of plants:</strong> {plantCount.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
