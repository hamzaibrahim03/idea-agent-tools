import { useState } from 'react';
export default function HarvestYieldEstimator() {
  const [area, setArea] = useState('75');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [yieldRate, setYieldRate] = useState('160');
  const [yieldUnit, setYieldUnit] = useState('bushels');
  const areaNum = Number(area);
  const yieldNum = Number(yieldRate);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(yieldNum) && yieldNum > 0;
  const totalHarvest = valid ? areaNum * yieldNum : null;
  return (
    <div className="tool-page">
      <h1>Harvest Yield Estimator</h1>
      <p className="tool-description">
        Enter your field area and an expected yield rate per acre or hectare to compute total expected
        harvest quantity. Actual yield depends on real field, weather, and crop conditions this site
        cannot measure, so enter your own expected rate (e.g. from field history or agronomist
        estimate) rather than a looked-up value. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="hye-area">Field area</label>
          <input id="hye-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="hye-areaunit">Area unit</label>
          <select id="hye-areaunit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="hye-rate">Expected yield rate (per {areaUnit === 'acres' ? 'acre' : 'hectare'})</label>
          <input id="hye-rate" type="number" min={0} step="0.01" value={yieldRate} onChange={(e) => setYieldRate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="hye-yieldunit">Yield unit</label>
          <select id="hye-yieldunit" value={yieldUnit} onChange={(e) => setYieldUnit(e.target.value)}>
            <option value="bushels">Bushels</option>
            <option value="tons">Tons</option>
            <option value="kg">Kilograms</option>
            <option value="lbs">Pounds</option>
          </select>
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive field area and a positive expected yield rate.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Estimated total harvest:</strong> {totalHarvest.toLocaleString(undefined, { maximumFractionDigits: 1 })} {yieldUnit}
          </div>
        </div>
      )}
    </div>
  );
}
