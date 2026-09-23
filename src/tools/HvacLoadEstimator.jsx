import { useState } from 'react';
const BTU_PER_TON = 12000;
const CLIMATE_PRESETS = {
  mild: { label: 'Mild climate - 20 BTU/sq ft', btuPerSqFt: 20 },
  moderate: { label: 'Moderate climate - 25 BTU/sq ft', btuPerSqFt: 25 },
  hot: { label: 'Hot climate - 30 BTU/sq ft', btuPerSqFt: 30 },
  custom: { label: 'Custom', btuPerSqFt: 25 }
};
export default function HvacLoadEstimator() {
  const [area, setArea] = useState('1800');
  const [preset, setPreset] = useState('moderate');
  const [btuPerSqFt, setBtuPerSqFt] = useState(CLIMATE_PRESETS.moderate.btuPerSqFt);
  function handlePreset(key) {
    setPreset(key);
    setBtuPerSqFt(CLIMATE_PRESETS[key].btuPerSqFt);
  }
  const areaNum = Number(area);
  const btuNum = Number(btuPerSqFt);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(btuNum) && btuNum > 0;
  const totalBtu = valid ? areaNum * btuNum : 0;
  const tons = totalBtu / BTU_PER_TON;
  return (
    <div className="tool-page">
      <h1>HVAC Load Estimator</h1>
      <p className="tool-description">
        Get a rough rule-of-thumb estimate of required heating/cooling capacity from floor area and
        a BTU-per-square-foot factor that varies by climate zone, then converts to tonnage using
        the standard 12,000 BTU/hr = 1 ton HVAC unit conversion. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Licensed professional required:</strong> This is a rough planning-stage
        rule-of-thumb only. A real HVAC load calculation (such as an ACCA Manual J calculation)
        accounts for insulation, windows, orientation, occupancy, and more, and requires a
        qualified HVAC professional.
      </div>
      <div className="tool-controls">
        <label>
          Climate zone:
          <select value={preset} onChange={(e) => handlePreset(e.target.value)}>
            {Object.entries(CLIMATE_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="hvac-area">Floor area (sq ft)</label>
          <input id="hvac-area" type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="hvac-btu">BTU/hr per sq ft (typical 20-30)</label>
          <input
            id="hvac-btu"
            type="number"
            min={0}
            value={btuPerSqFt}
            onChange={(e) => {
              setPreset('custom');
              setBtuPerSqFt(e.target.value);
            }}
          />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive values for floor area and BTU factor.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Estimated capacity:</strong> {totalBtu.toFixed(0)} BTU/hr
          </div>
          <div>
            <strong>Approximate tonnage:</strong> {tons.toFixed(2)} tons
          </div>
        </div>
      )}
    </div>
  );
}
