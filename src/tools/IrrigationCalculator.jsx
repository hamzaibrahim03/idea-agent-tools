import { useState } from 'react';
export default function IrrigationCalculator() {
  const [areaAcres, setAreaAcres] = useState('10');
  const [waterReqIn, setWaterReqIn] = useState('1.5');
  const [efficiency, setEfficiency] = useState('85');
  const [outputUnit, setOutputUnit] = useState('gallons');
  const areaNum = Number(areaAcres);
  const waterReqNum = Number(waterReqIn);
  const efficiencyNum = Number(efficiency);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(waterReqNum) && waterReqNum > 0 &&
    Number.isFinite(efficiencyNum) && efficiencyNum > 0 && efficiencyNum <= 100;
  let volumeGallons = null;
  if (valid) {
    const grossGallons = areaNum * waterReqNum * 27154;
    volumeGallons = grossGallons / (efficiencyNum / 100);
  }
  const volumeLiters = volumeGallons !== null ? volumeGallons * 3.78541 : null;
  return (
    <div className="tool-page">
      <h1>Irrigation Calculator</h1>
      <p className="tool-description">
        Enter field area, crop water requirement, and your irrigation system's efficiency to estimate
        total water volume needed per week. Water requirement varies by crop and climate, so enter
        your own figure (e.g. from local agricultural extension guidance) rather than a looked-up
        value. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="irr-area">Field area (acres)</label>
          <input id="irr-area" type="number" min={0} step="0.01" value={areaAcres} onChange={(e) => setAreaAcres(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-req">Crop water requirement (inches/week)</label>
          <input id="irr-req" type="number" min={0} step="0.01" value={waterReqIn} onChange={(e) => setWaterReqIn(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-eff">Irrigation system efficiency (%)</label>
          <input id="irr-eff" type="number" min={1} max={100} step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-unit">Output unit</label>
          <select id="irr-unit" value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)}>
            <option value="gallons">Gallons</option>
            <option value="liters">Liters</option>
          </select>
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive field area, positive water requirement, and efficiency between 1 and 100%.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Water needed per week:</strong>{' '}
            {outputUnit === 'gallons'
              ? `${volumeGallons.toLocaleString(undefined, { maximumFractionDigits: 0 })} gallons`
              : `${volumeLiters.toLocaleString(undefined, { maximumFractionDigits: 0 })} liters`}
          </div>
        </div>
      )}
    </div>
  );
}
