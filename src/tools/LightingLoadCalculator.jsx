import { useState } from 'react';
const PRESETS = {
  residential: { label: 'Residential (dwelling) - 3 W/sq ft', wattsPerSqFt: 3 },
  office: { label: 'Office - 3.5 W/sq ft', wattsPerSqFt: 3.5 },
  retail: { label: 'Retail store - 3 W/sq ft', wattsPerSqFt: 3 },
  warehouse: { label: 'Warehouse/storage - 0.25 W/sq ft', wattsPerSqFt: 0.25 },
  school: { label: 'School/classroom - 3 W/sq ft', wattsPerSqFt: 3 },
  custom: { label: 'Custom', wattsPerSqFt: 3 }
};
export default function LightingLoadCalculator() {
  const [area, setArea] = useState('1500');
  const [preset, setPreset] = useState('residential');
  const [wattsPerSqFt, setWattsPerSqFt] = useState(PRESETS.residential.wattsPerSqFt);
  const [voltage, setVoltage] = useState('120');
  function handlePreset(key) {
    setPreset(key);
    setWattsPerSqFt(PRESETS[key].wattsPerSqFt);
  }
  const areaNum = Number(area);
  const wattsNum = Number(wattsPerSqFt);
  const voltageNum = Number(voltage);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(wattsNum) && wattsNum > 0 &&
    Number.isFinite(voltageNum) && voltageNum > 0;
  const totalWatts = valid ? areaNum * wattsNum : 0;
  const totalAmps = valid ? totalWatts / voltageNum : 0;
  return (
    <div className="tool-page">
      <h1>Lighting Load Calculator</h1>
      <p className="tool-description">
        Estimate general lighting load in watts and amps from floor area and a standard
        watts-per-square-foot unit load figure (in the style of NEC/NFPA 70 general lighting load
        tables), adjustable by occupancy type. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Licensed professional required:</strong> This is a rough general-lighting load
        estimate using published rule-of-thumb unit values. For actual electrical permits, panel
        sizing, or installation, a licensed electrician or engineer must verify all values against
        local code (e.g. NEC in the US).
      </div>
      <div className="tool-controls">
        <label>
          Occupancy type:
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
          <label htmlFor="ll-area">Floor area (sq ft)</label>
          <input id="ll-area" type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ll-watts">Lighting load factor (W/sq ft)</label>
          <input
            id="ll-watts"
            type="number"
            min={0}
            step="0.01"
            value={wattsPerSqFt}
            onChange={(e) => {
              setPreset('custom');
              setWattsPerSqFt(e.target.value);
            }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="ll-voltage">Voltage (V)</label>
          <input id="ll-voltage" type="number" min={0} value={voltage} onChange={(e) => setVoltage(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive values for floor area, lighting load factor, and
          voltage.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Total lighting load:</strong> {totalWatts.toFixed(0)} W
          </div>
          <div>
            <strong>Required amperage:</strong> {totalAmps.toFixed(2)} A
          </div>
        </div>
      )}
    </div>
  );
}
