import { useState } from 'react';
const MATERIAL_RATES = [
  { name: 'Concrete (foundation & slab)', unit: 'cu yd', perSqFt: 0.045 },
  { name: 'Structural steel / rebar', unit: 'lb', perSqFt: 4 },
  { name: 'Bricks (if brick veneer)', unit: 'bricks', perSqFt: 7 },
  { name: 'Lumber (framing)', unit: 'board ft', perSqFt: 6 },
  { name: 'Drywall', unit: 'sq ft', perSqFt: 2.8 },
  { name: 'Roofing material', unit: 'sq ft', perSqFt: 0.45 },
  { name: 'Paint', unit: 'gallons', perSqFt: 0.02 }
];
export default function BuildingMaterialEstimator() {
  const [floorArea, setFloorArea] = useState('2000');
  const [floors, setFloors] = useState('1');
  const areaNum = Number(floorArea);
  const floorsNum = Number(floors);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(floorsNum) && floorsNum > 0;
  const totalArea = valid ? areaNum * floorsNum : 0;
  return (
    <div className="tool-page">
      <h1>Building Material Estimator</h1>
      <p className="tool-description">
        Get a very rough planning-stage estimate of major material quantities - concrete, steel,
        bricks, lumber, and more - from total floor area and number of floors, using commonly
        published per-square-foot material intensity figures. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Rough planning estimate only:</strong> These figures are generic rule-of-thumb
        intensities and vary enormously by building type, structural system, and region. This is
        not a substitute for a quantity surveyor's or engineer's real material takeoff - use only
        for very early, rough planning purposes.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="bm-area">Floor area per floor (sq ft)</label>
          <input id="bm-area" type="number" min={0} value={floorArea} onChange={(e) => setFloorArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="bm-floors">Number of floors</label>
          <input id="bm-floors" type="number" min={1} value={floors} onChange={(e) => setFloors(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive floor area and number of floors.
        </div>
      )}
      {valid && (
        <>
          <div className="timestamp-result">
            <strong>Total floor area:</strong> {totalArea.toFixed(0)} sq ft
          </div>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Rough estimated quantity</th>
                </tr>
              </thead>
              <tbody>
                {MATERIAL_RATES.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td>
                      <code>{(m.perSqFt * totalArea).toFixed(1)} {m.unit}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
