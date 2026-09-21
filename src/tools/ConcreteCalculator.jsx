import { useState } from 'react';
const BAG_YIELDS_CU_FT = {
  40: 0.3,
  60: 0.45,
  80: 0.6
};
function slabVolumeCuFt(lengthFt, widthFt, thicknessIn) {
  return lengthFt * widthFt * (thicknessIn / 12);
}
export default function ConcreteCalculator() {
  const [shape, setShape] = useState('slab');
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('10');
  const [thickness, setThickness] = useState('4');
  const [diameter, setDiameter] = useState('12');
  const [depth, setDepth] = useState('36');
  const [waste, setWaste] = useState('10');
  const [bagSize, setBagSize] = useState('60');
  const lengthNum = Number(length);
  const widthNum = Number(width);
  const thicknessNum = Number(thickness);
  const diameterNum = Number(diameter);
  const depthNum = Number(depth);
  const wasteNum = Number(waste);
  let volumeCuFt = null;
  let valid = false;
  if (shape === 'slab') {
    valid =
      Number.isFinite(lengthNum) && lengthNum > 0 &&
      Number.isFinite(widthNum) && widthNum > 0 &&
      Number.isFinite(thicknessNum) && thicknessNum > 0;
    if (valid) volumeCuFt = slabVolumeCuFt(lengthNum, widthNum, thicknessNum);
  } else {
    valid =
      Number.isFinite(diameterNum) && diameterNum > 0 &&
      Number.isFinite(depthNum) && depthNum > 0;
    if (valid) {
      const radiusFt = diameterNum / 12 / 2;
      volumeCuFt = Math.PI * radiusFt * radiusFt * (depthNum / 12);
    }
  }
  const wasteValid = Number.isFinite(wasteNum) && wasteNum >= 0;
  const volumeWithWaste = volumeCuFt !== null && wasteValid ? volumeCuFt * (1 + wasteNum / 100) : null;
  const volumeCuYd = volumeWithWaste !== null ? volumeWithWaste / 27 : null;
  const bagsNeeded = volumeWithWaste !== null ? Math.ceil(volumeWithWaste / BAG_YIELDS_CU_FT[bagSize]) : null;
  return (
    <div className="tool-page">
      <h1>Concrete Volume &amp; Bags Calculator</h1>
      <p className="tool-description">
        Calculate how much concrete you need for a slab, footing, or post hole - in cubic feet,
        cubic yards, and number of pre-mix bags. This is an estimate for planning purposes;
        confirm with your supplier before ordering. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="radio" name="shape" checked={shape === 'slab'} onChange={() => setShape('slab')} />
          Slab / footing (rectangular)
        </label>
        <label className="checkbox-label">
          <input type="radio" name="shape" checked={shape === 'cylinder'} onChange={() => setShape('cylinder')} />
          Post hole (cylindrical)
        </label>
      </div>
      {shape === 'slab' ? (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="slab-length">Length (ft)</label>
            <input id="slab-length" type="number" min={0} value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="slab-width">Width (ft)</label>
            <input id="slab-width" type="number" min={0} value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="slab-thickness">Thickness (in)</label>
            <input id="slab-thickness" type="number" min={0} value={thickness} onChange={(e) => setThickness(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="tool-grid">
          <div className="tool-panel">
            <label htmlFor="hole-diameter">Hole diameter (in)</label>
            <input id="hole-diameter" type="number" min={0} value={diameter} onChange={(e) => setDiameter(e.target.value)} />
          </div>
          <div className="tool-panel">
            <label htmlFor="hole-depth">Hole depth (in)</label>
            <input id="hole-depth" type="number" min={0} value={depth} onChange={(e) => setDepth(e.target.value)} />
          </div>
        </div>
      )}
      <div className="tool-grid" style={{ marginTop: 12 }}>
        <div className="tool-panel">
          <label htmlFor="waste-pct">Waste allowance (%)</label>
          <input id="waste-pct" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="bag-size">Pre-mix bag size</label>
          <select id="bag-size" value={bagSize} onChange={(e) => setBagSize(e.target.value)}>
            <option value="40">40 lb bag (~0.3 cu ft)</option>
            <option value="60">60 lb bag (~0.45 cu ft)</option>
            <option value="80">80 lb bag (~0.6 cu ft)</option>
          </select>
        </div>
      </div>
      {(!valid || !wasteValid) && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive dimensions and a non-negative waste percentage.
        </div>
      )}
      {volumeWithWaste !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Volume:</strong> {volumeCuFt.toFixed(2)} cu ft (before waste)
          </div>
          <div>
            <strong>Volume with waste:</strong> {volumeWithWaste.toFixed(2)} cu ft / {volumeCuYd.toFixed(3)} cu yd
          </div>
          <div>
            <strong>{bagSize} lb bags needed:</strong> {bagsNeeded}
          </div>
        </div>
      )}
    </div>
  );
}
