import { useState } from 'react';
const DRY_VOLUME_FACTOR = 1.54;
const CEMENT_DENSITY_KG_M3 = 1440;
const CEMENT_BAG_KG = 50;
const MIX_RATIOS = {
  '1:1.5:3': { cement: 1, sand: 1.5, aggregate: 3, label: '1:1.5:3 (M20, structural)' },
  '1:2:4': { cement: 1, sand: 2, aggregate: 4, label: '1:2:4 (M15, general RCC)' },
  '1:3:6': { cement: 1, sand: 3, aggregate: 6, label: '1:3:6 (M10, mass concrete)' },
  '1:4:8': { cement: 1, sand: 4, aggregate: 8, label: '1:4:8 (PCC, leveling/foundation)' }
};
export default function MaterialCalculator() {
  const [area, setArea] = useState('50');
  const [thickness, setThickness] = useState('100');
  const [ratioKey, setRatioKey] = useState('1:2:4');
  const [steelDensity, setSteelDensity] = useState('80');
  const areaNum = Number(area);
  const thicknessNum = Number(thickness);
  const steelDensityNum = Number(steelDensity);
  const ratio = MIX_RATIOS[ratioKey];
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(thicknessNum) && thicknessNum > 0 &&
    Number.isFinite(steelDensityNum) && steelDensityNum >= 0;
  let result = null;
  if (valid) {
    const wetVolumeM3 = areaNum * (thicknessNum / 1000);
    const dryVolumeM3 = wetVolumeM3 * DRY_VOLUME_FACTOR;
    const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
    const cementVolumeM3 = (dryVolumeM3 * ratio.cement) / totalParts;
    const sandVolumeM3 = (dryVolumeM3 * ratio.sand) / totalParts;
    const aggregateVolumeM3 = (dryVolumeM3 * ratio.aggregate) / totalParts;
    const cementKg = cementVolumeM3 * CEMENT_DENSITY_KG_M3;
    const cementBags = cementKg / CEMENT_BAG_KG;
    const steelKg = areaNum * steelDensityNum;
    result = {
      wetVolumeM3,
      dryVolumeM3,
      cementVolumeM3,
      sandVolumeM3,
      aggregateVolumeM3,
      cementBags,
      steelKg
    };
  }
  return (
    <div className="tool-page">
      <h1>Construction Material Calculator</h1>
      <p className="tool-description">
        Estimate cement, sand, aggregate, and steel reinforcement quantities for a slab or room using
        the standard dry-volume concrete mix-ratio method (wet volume x 1.54 to account for voids,
        then split by your chosen mix ratio). Steel weight is estimated from a reinforcement density
        you provide per square meter. This is a planning estimate - confirm with a structural
        engineer before ordering materials. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mix ratio (cement:sand:aggregate):
          <select value={ratioKey} onChange={(e) => setRatioKey(e.target.value)}>
            {Object.entries(MIX_RATIOS).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="area">Area (sq m)</label>
          <input id="area" type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="thickness">Thickness (mm)</label>
          <input id="thickness" type="number" min={0} value={thickness} onChange={(e) => setThickness(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="steel-density">Steel reinforcement density (kg per sq m)</label>
          <input
            id="steel-density"
            type="number"
            min={0}
            value={steelDensity}
            onChange={(e) => setSteelDensity(e.target.value)}
          />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive area, positive thickness, and non-negative steel density.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Wet concrete volume:</strong> {result.wetVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Dry volume (x1.54):</strong> {result.dryVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Cement:</strong> {result.cementVolumeM3.toFixed(3)} m³ (~{Math.ceil(result.cementBags)} bags of 50 kg)
          </div>
          <div>
            <strong>Sand:</strong> {result.sandVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Aggregate:</strong> {result.aggregateVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Steel reinforcement:</strong> {result.steelKg.toFixed(1)} kg
          </div>
        </div>
      )}
    </div>
  );
}
