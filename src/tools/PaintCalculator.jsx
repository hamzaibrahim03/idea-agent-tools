import { useState } from 'react';
const DEFAULT_COVERAGE_SQFT_PER_GAL = 350;
export default function PaintCalculator() {
  const [wallLength, setWallLength] = useState('40');
  const [wallHeight, setWallHeight] = useState('8');
  const [openingsArea, setOpeningsArea] = useState('20');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState(String(DEFAULT_COVERAGE_SQFT_PER_GAL));
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const coatsNum = Number(coats);
  const coverageNum = Number(coverage);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(coatsNum) && coatsNum > 0 &&
    Number.isFinite(coverageNum) && coverageNum > 0;
  const grossArea = valid ? lengthNum * heightNum : 0;
  const netArea = valid ? Math.max(0, grossArea - openingsNum) : 0;
  const totalAreaToPaint = valid ? netArea * coatsNum : 0;
  const gallonsNeeded = valid && netArea > 0 ? totalAreaToPaint / coverageNum : null;
  return (
    <div className="tool-page">
      <h1>Paint Coverage Calculator</h1>
      <p className="tool-description">
        Calculate how much paint you need for a wall or room, based on wall area, number of
        coats, and your paint's coverage rate. Coverage varies by brand and surface - check the
        can label for the most accurate figure. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="paint-length">Wall length / perimeter (ft)</label>
          <input id="paint-length" type="number" min={0} value={wallLength} onChange={(e) => setWallLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="paint-height">Wall height (ft)</label>
          <input id="paint-height" type="number" min={0} value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="paint-openings">Doors/windows area to subtract (sq ft)</label>
          <input id="paint-openings" type="number" min={0} value={openingsArea} onChange={(e) => setOpeningsArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="paint-coats">Number of coats</label>
          <input id="paint-coats" type="number" min={1} value={coats} onChange={(e) => setCoats(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="paint-coverage">Coverage (sq ft per gallon)</label>
          <input id="paint-coverage" type="number" min={1} value={coverage} onChange={(e) => setCoverage(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive dimensions, at least 1 coat, and a positive coverage rate.
        </div>
      )}
      {valid && netArea <= 0 && (
        <div className="tool-error">
          <strong>Error:</strong> Net area after subtracting openings must be greater than zero.
        </div>
      )}
      {gallonsNeeded !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Net area to paint:</strong> {netArea.toFixed(1)} sq ft
          </div>
          <div>
            <strong>Total area with {coats} coat(s):</strong> {totalAreaToPaint.toFixed(1)} sq ft
          </div>
          <div>
            <strong>Paint needed:</strong> {gallonsNeeded.toFixed(2)} gallons ({Math.ceil(gallonsNeeded)} gallon can(s))
          </div>
        </div>
      )}
    </div>
  );
}
