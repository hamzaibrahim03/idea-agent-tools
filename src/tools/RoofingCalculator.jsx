import { useState } from 'react';
function pitchMultiplier(riseIn12) {
  return Math.sqrt(1 + (riseIn12 / 12) ** 2);
}
const BUNDLES_PER_SQUARE = 3;
export default function RoofingCalculator() {
  const [footprintLength, setFootprintLength] = useState('40');
  const [footprintWidth, setFootprintWidth] = useState('30');
  const [pitch, setPitch] = useState('6');
  const [waste, setWaste] = useState('10');
  const lengthNum = Number(footprintLength);
  const widthNum = Number(footprintWidth);
  const pitchNum = Number(pitch);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(widthNum) && widthNum > 0 &&
    Number.isFinite(pitchNum) && pitchNum >= 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const footprintArea = valid ? lengthNum * widthNum : 0;
  const multiplier = valid ? pitchMultiplier(pitchNum) : 1;
  const roofArea = footprintArea * multiplier;
  const roofAreaWithWaste = roofArea * (1 + wasteNum / 100);
  const squares = roofAreaWithWaste / 100;
  const bundles = Math.ceil(squares * BUNDLES_PER_SQUARE);
  return (
    <div className="tool-page">
      <h1>Roofing Materials Calculator</h1>
      <p className="tool-description">
        Estimate roof surface area and shingle bundles needed from the building's footprint and
        roof pitch. Roofing is complex (hips, valleys, dormers) - this gives a planning-stage
        estimate for a simple roof shape, not a substitute for a contractor's measurement. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="roof-length">Building footprint length (ft)</label>
          <input id="roof-length" type="number" min={0} value={footprintLength} onChange={(e) => setFootprintLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-width">Building footprint width (ft)</label>
          <input id="roof-width" type="number" min={0} value={footprintWidth} onChange={(e) => setFootprintWidth(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-pitch">Roof pitch (rise per 12 in run)</label>
          <input id="roof-pitch" type="number" min={0} value={pitch} onChange={(e) => setPitch(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-waste">Waste allowance (%)</label>
          <input id="roof-waste" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive footprint dimensions and non-negative pitch/waste values.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Footprint area:</strong> {footprintArea.toFixed(1)} sq ft
          </div>
          <div>
            <strong>Pitch multiplier:</strong> {multiplier.toFixed(3)}× ({pitchNum}:12 pitch)
          </div>
          <div>
            <strong>Actual roof area:</strong> {roofArea.toFixed(1)} sq ft
          </div>
          <div>
            <strong>With {waste}% waste:</strong> {roofAreaWithWaste.toFixed(1)} sq ft ({squares.toFixed(2)} squares)
          </div>
          <div>
            <strong>Shingle bundles needed:</strong> {bundles} (at {BUNDLES_PER_SQUARE}/square)
          </div>
        </div>
      )}
    </div>
  );
}
