import { useState } from 'react';
const PRESETS = {
  'drywall-4x8': { label: 'Drywall panel (4×8 ft = 32 sq ft/unit)', coverage: 32 },
  'drywall-4x12': { label: 'Drywall panel (4×12 ft = 48 sq ft/unit)', coverage: 48 },
  'siding-lap': { label: 'Lap siding piece (~8 sq ft/unit)', coverage: 8 },
  'osb-4x8': { label: 'OSB/plywood sheet (4×8 ft = 32 sq ft/unit)', coverage: 32 },
  custom: { label: 'Custom coverage rate', coverage: 32 }
};
export default function WallMaterialCalculator() {
  const [wallArea, setWallArea] = useState('320');
  const [preset, setPreset] = useState('drywall-4x8');
  const [coverage, setCoverage] = useState(PRESETS['drywall-4x8'].coverage);
  const [waste, setWaste] = useState('10');
  function handlePreset(key) {
    setPreset(key);
    setCoverage(PRESETS[key].coverage);
  }
  const areaNum = Number(wallArea);
  const coverageNum = Number(coverage);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(coverageNum) && coverageNum > 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const rawUnits = valid ? areaNum / coverageNum : 0;
  const unitsWithWaste = valid ? rawUnits * (1 + wasteNum / 100) : 0;
  return (
    <div className="tool-page">
      <h1>Wall Material Calculator</h1>
      <p className="tool-description">
        Estimate how many sheets or panels of a wall material - drywall, siding, OSB, or any
        sheet/panel product - you need, given the wall area, the material's coverage rate per
        unit, and a waste allowance for cuts and offcuts. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Material preset:
          <select value={preset} onChange={(e) => handlePreset(e.target.value)}>
            {Object.entries(PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="wm-area">Total wall area (sq ft)</label>
          <input id="wm-area" type="number" min={0} value={wallArea} onChange={(e) => setWallArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="wm-coverage">Coverage rate (sq ft per unit)</label>
          <input
            id="wm-coverage"
            type="number"
            min={0}
            value={coverage}
            onChange={(e) => {
              setPreset('custom');
              setCoverage(e.target.value);
            }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="wm-waste">Waste allowance (%)</label>
          <input id="wm-waste" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive wall area and coverage rate, and a non-negative
          waste percentage.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Raw units needed:</strong> {rawUnits.toFixed(2)}
          </div>
          <div>
            <strong>With {waste}% waste:</strong> {Math.ceil(unitsWithWaste)} units
          </div>
        </div>
      )}
    </div>
  );
}
