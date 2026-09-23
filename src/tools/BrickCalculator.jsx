import { useState } from 'react';
function bricksNeeded(wallAreaSqFt, brickLengthIn, brickHeightIn, jointIn, wastePercent) {
  const effLength = (brickLengthIn + jointIn) / 12;
  const effHeight = (brickHeightIn + jointIn) / 12;
  const bricksPerSqFt = 1 / (effLength * effHeight);
  const rawCount = wallAreaSqFt * bricksPerSqFt;
  const withWaste = rawCount * (1 + wastePercent / 100);
  return { bricksPerSqFt, rawCount, withWaste };
}
const PRESETS = {
  modular: { label: 'US Modular Brick (7.625 × 2.25 in) - ~6.9/sq ft', length: 7.625, height: 2.25 },
  'standard-us': { label: 'US Standard Brick (8 × 2.25 in)', length: 8, height: 2.25 },
  'uk-metric': { label: 'UK Metric Brick (8.66 × 2.56 in / 220 × 65 mm)', length: 8.66, height: 2.56 },
  block: { label: 'Concrete Block (15.625 × 7.625 in)', length: 15.625, height: 7.625 }
};
export default function BrickCalculator() {
  const [wallLength, setWallLength] = useState('20');
  const [wallHeight, setWallHeight] = useState('8');
  const [openingsArea, setOpeningsArea] = useState('0');
  const [preset, setPreset] = useState('modular');
  const [brickLength, setBrickLength] = useState(PRESETS.modular.length);
  const [brickHeight, setBrickHeight] = useState(PRESETS.modular.height);
  const [joint, setJoint] = useState('0.375');
  const [waste, setWaste] = useState('10');
  function handlePreset(key) {
    setPreset(key);
    setBrickLength(PRESETS[key].length);
    setBrickHeight(PRESETS[key].height);
  }
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const brickLengthNum = Number(brickLength);
  const brickHeightNum = Number(brickHeight);
  const jointNum = Number(joint);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(brickLengthNum) && brickLengthNum > 0 &&
    Number.isFinite(brickHeightNum) && brickHeightNum > 0 &&
    Number.isFinite(jointNum) && jointNum >= 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const wallArea = valid ? Math.max(0, lengthNum * heightNum - openingsNum) : 0;
  const result = valid && wallArea > 0
    ? bricksNeeded(wallArea, brickLengthNum, brickHeightNum, jointNum, wasteNum)
    : null;
  return (
    <div className="tool-page">
      <h1>Brick &amp; Block Calculator</h1>
      <p className="tool-description">
        Estimate how many bricks or concrete blocks you need for a wall, based on wall size,
        brick size, mortar joint thickness, and a waste allowance for cuts and breakage. This is
        an estimate for planning purposes - always confirm quantities with your supplier or a
        professional before ordering. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Brick/block size:
          <select value={preset} onChange={(e) => handlePreset(e.target.value)}>
            {Object.entries(PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="wall-length">Wall length (ft)</label>
          <input id="wall-length" type="number" min={0} value={wallLength} onChange={(e) => setWallLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="wall-height">Wall height (ft)</label>
          <input id="wall-height" type="number" min={0} value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="openings-area">Doors/windows area to subtract (sq ft)</label>
          <input id="openings-area" type="number" min={0} value={openingsArea} onChange={(e) => setOpeningsArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="waste-pct">Waste allowance (%)</label>
          <input id="waste-pct" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="brick-length">Brick/block length (in)</label>
          <input
            id="brick-length"
            type="number"
            min={0}
            step="0.001"
            value={brickLength}
            onChange={(e) => {
              setPreset('custom');
              setBrickLength(e.target.value);
            }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="brick-height">Brick/block height (in)</label>
          <input
            id="brick-height"
            type="number"
            min={0}
            step="0.001"
            value={brickHeight}
            onChange={(e) => {
              setPreset('custom');
              setBrickHeight(e.target.value);
            }}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="joint">Mortar joint thickness (in)</label>
          <input id="joint" type="number" min={0} step="0.0625" value={joint} onChange={(e) => setJoint(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive wall dimensions and brick/block dimensions.
        </div>
      )}
      {valid && wallArea <= 0 && (
        <div className="tool-error">
          <strong>Error:</strong> Wall area after subtracting openings must be greater than zero.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Net wall area:</strong> {wallArea.toFixed(2)} sq ft
          </div>
          <div>
            <strong>Bricks/blocks per sq ft:</strong> {result.bricksPerSqFt.toFixed(3)}
          </div>
          <div>
            <strong>Raw count needed:</strong> {Math.ceil(result.rawCount)}
          </div>
          <div>
            <strong>With {waste}% waste allowance:</strong> {Math.ceil(result.withWaste)} bricks/blocks
          </div>
        </div>
      )}
    </div>
  );
}
