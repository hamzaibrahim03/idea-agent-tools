import { useState } from 'react';
const GALLONS_PER_CUFT = 7.48052;
export default function WaterTankCalculator() {
  const [mode, setMode] = useState('demand');
  const [occupants, setOccupants] = useState('4');
  const [usagePerPerson, setUsagePerPerson] = useState('75');
  const [days, setDays] = useState('3');
  const [tankShape, setTankShape] = useState('cylindrical');
  const [diameter, setDiameter] = useState('4');
  const [heightCyl, setHeightCyl] = useState('6');
  const [lengthRect, setLengthRect] = useState('6');
  const [widthRect, setWidthRect] = useState('4');
  const [heightRect, setHeightRect] = useState('4');
  const occupantsNum = Number(occupants);
  const usageNum = Number(usagePerPerson);
  const daysNum = Number(days);
  const demandValid =
    Number.isFinite(occupantsNum) && occupantsNum > 0 &&
    Number.isFinite(usageNum) && usageNum > 0 &&
    Number.isFinite(daysNum) && daysNum > 0;
  const demandGallons = demandValid ? occupantsNum * usageNum * daysNum : null;
  let tankGallons = null;
  let tankError = '';
  if (tankShape === 'cylindrical') {
    const d = Number(diameter);
    const h = Number(heightCyl);
    if (!(d > 0 && h > 0)) tankError = 'Enter a positive diameter and height.';
    else {
      const r = d / 2;
      const cuft = Math.PI * r * r * h;
      tankGallons = cuft * GALLONS_PER_CUFT;
    }
  } else {
    const l = Number(lengthRect);
    const w = Number(widthRect);
    const h = Number(heightRect);
    if (!(l > 0 && w > 0 && h > 0)) tankError = 'Enter positive length, width, and height.';
    else tankGallons = l * w * h * GALLONS_PER_CUFT;
  }
  return (
    <div className="tool-page">
      <h1>Water Tank Calculator</h1>
      <p className="tool-description">
        Estimate required water storage capacity from occupants, daily usage per person, and
        desired days of storage - or compute the volume of a cylindrical or rectangular tank
        directly from its dimensions. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="demand">Estimate capacity needed</option>
            <option value="tank">Calculate tank volume</option>
          </select>
        </label>
      </div>
      {mode === 'demand' ? (
        <>
          <div className="tool-grid">
            <div className="tool-panel">
              <label htmlFor="wt-occupants">Number of occupants</label>
              <input id="wt-occupants" type="number" min={0} value={occupants} onChange={(e) => setOccupants(e.target.value)} />
            </div>
            <div className="tool-panel">
              <label htmlFor="wt-usage">Usage per person (gal/day, typical 50-100)</label>
              <input id="wt-usage" type="number" min={0} value={usagePerPerson} onChange={(e) => setUsagePerPerson(e.target.value)} />
            </div>
            <div className="tool-panel">
              <label htmlFor="wt-days">Days of storage desired</label>
              <input id="wt-days" type="number" min={0} value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
          </div>
          {!demandValid && (
            <div className="tool-error">
              <strong>Error:</strong> Enter positive values for occupants, usage per person, and
              days of storage.
            </div>
          )}
          {demandGallons !== null && (
            <div className="timestamp-result">
              <strong>Required tank capacity:</strong> {demandGallons.toFixed(0)} gallons (
              {(demandGallons / GALLONS_PER_CUFT).toFixed(1)} cu ft)
            </div>
          )}
        </>
      ) : (
        <>
          <div className="tool-controls">
            <label>
              Tank shape:
              <select value={tankShape} onChange={(e) => setTankShape(e.target.value)}>
                <option value="cylindrical">Cylindrical</option>
                <option value="rectangular">Rectangular</option>
              </select>
            </label>
          </div>
          {tankShape === 'cylindrical' ? (
            <div className="tool-grid">
              <div className="tool-panel">
                <label htmlFor="wt-diameter">Diameter (ft)</label>
                <input id="wt-diameter" type="number" min={0} value={diameter} onChange={(e) => setDiameter(e.target.value)} />
              </div>
              <div className="tool-panel">
                <label htmlFor="wt-height-cyl">Height (ft)</label>
                <input id="wt-height-cyl" type="number" min={0} value={heightCyl} onChange={(e) => setHeightCyl(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="tool-grid">
              <div className="tool-panel">
                <label htmlFor="wt-length-rect">Length (ft)</label>
                <input id="wt-length-rect" type="number" min={0} value={lengthRect} onChange={(e) => setLengthRect(e.target.value)} />
              </div>
              <div className="tool-panel">
                <label htmlFor="wt-width-rect">Width (ft)</label>
                <input id="wt-width-rect" type="number" min={0} value={widthRect} onChange={(e) => setWidthRect(e.target.value)} />
              </div>
              <div className="tool-panel">
                <label htmlFor="wt-height-rect">Height (ft)</label>
                <input id="wt-height-rect" type="number" min={0} value={heightRect} onChange={(e) => setHeightRect(e.target.value)} />
              </div>
            </div>
          )}
          {tankError && <div className="tool-error">{tankError}</div>}
          {tankGallons !== null && !tankError && (
            <div className="timestamp-result">
              <strong>Tank volume:</strong> {tankGallons.toFixed(0)} gallons ({(tankGallons / GALLONS_PER_CUFT).toFixed(1)} cu ft)
            </div>
          )}
        </>
      )}
    </div>
  );
}
