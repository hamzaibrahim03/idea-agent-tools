import { useState } from 'react';
export default function PlasterCalculator() {
  const [wallLength, setWallLength] = useState('20');
  const [wallHeight, setWallHeight] = useState('8');
  const [openingsArea, setOpeningsArea] = useState('0');
  const [thicknessMm, setThicknessMm] = useState('12');
  const [coverageSqFtPerBag, setCoverageSqFtPerBag] = useState('40');
  const [waste, setWaste] = useState('10');
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const thicknessNum = Number(thicknessMm);
  const coverageNum = Number(coverageSqFtPerBag);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(thicknessNum) && thicknessNum > 0 &&
    Number.isFinite(coverageNum) && coverageNum > 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const grossArea = valid ? lengthNum * heightNum : 0;
  const netArea = valid ? Math.max(0, grossArea - openingsNum) : 0;
  const netAreaSqM = netArea * 0.092903;
  const volumeCuM = netAreaSqM * (thicknessNum / 1000);
  const volumeCuFt = volumeCuM / 0.0283168;
  const areaWithWaste = netArea * (1 + wasteNum / 100);
  const bagsNeeded = valid && netArea > 0 ? Math.ceil(areaWithWaste / coverageNum) : null;
  return (
    <div className="tool-page">
      <h1>Plaster / Render Calculator</h1>
      <p className="tool-description">
        Estimate the volume and number of bags of plaster or render needed to cover a wall, based
        on wall area, coat thickness, and your product's coverage per bag. Coverage varies
        significantly by product - check the bag label for the most accurate figure. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="plaster-length">Wall length (ft)</label>
          <input id="plaster-length" type="number" min={0} value={wallLength} onChange={(e) => setWallLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-height">Wall height (ft)</label>
          <input id="plaster-height" type="number" min={0} value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-openings">Doors/windows area to subtract (sq ft)</label>
          <input id="plaster-openings" type="number" min={0} value={openingsArea} onChange={(e) => setOpeningsArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-thickness">Coat thickness (mm)</label>
          <input id="plaster-thickness" type="number" min={0} value={thicknessMm} onChange={(e) => setThicknessMm(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-coverage">Bag coverage (sq ft per bag)</label>
          <input id="plaster-coverage" type="number" min={0} value={coverageSqFtPerBag} onChange={(e) => setCoverageSqFtPerBag(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-waste">Waste allowance (%)</label>
          <input id="plaster-waste" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive dimensions, thickness, and coverage, and a non-negative waste percentage.
        </div>
      )}
      {valid && netArea <= 0 && (
        <div className="tool-error">
          <strong>Error:</strong> Net area after subtracting openings must be greater than zero.
        </div>
      )}
      {bagsNeeded !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Net area to cover:</strong> {netArea.toFixed(2)} sq ft
          </div>
          <div>
            <strong>Estimated volume:</strong> {volumeCuFt.toFixed(2)} cu ft ({volumeCuM.toFixed(3)} m³)
          </div>
          <div>
            <strong>Bags needed (with {waste}% waste):</strong> {bagsNeeded}
          </div>
        </div>
      )}
    </div>
  );
}
