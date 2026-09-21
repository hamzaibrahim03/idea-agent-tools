import { useState } from 'react';
export default function FertilizerCalculator() {
  const [area, setArea] = useState('40');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [targetRate, setTargetRate] = useState('60');
  const [productPercent, setProductPercent] = useState('20');
  const areaNum = Number(area);
  const rateNum = Number(targetRate);
  const percentNum = Number(productPercent);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(rateNum) && rateNum > 0 &&
    Number.isFinite(percentNum) && percentNum > 0 && percentNum <= 100;
  const productPerArea = valid ? rateNum / (percentNum / 100) : null;
  const totalProduct = valid ? productPerArea * areaNum : null;
  return (
    <div className="tool-page">
      <h1>Fertilizer Calculator</h1>
      <p className="tool-description">
        Enter your field area, target nutrient application rate, and the fertilizer product's nutrient
        percentage (e.g. a 20% N product) to compute total product quantity needed, using the standard
        formula: product needed = (target rate / product nutrient %) x area. Runs entirely in your
        browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="fert-area">Field area</label>
          <input id="fert-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fert-areaunit">Area unit</label>
          <select id="fert-areaunit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="fert-rate">Target nutrient rate (lbs or kg per {areaUnit === 'acres' ? 'acre' : 'hectare'})</label>
          <input id="fert-rate" type="number" min={0} step="0.01" value={targetRate} onChange={(e) => setTargetRate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fert-percent">Product nutrient percentage (%)</label>
          <input id="fert-percent" type="number" min={0} max={100} step="0.1" value={productPercent} onChange={(e) => setProductPercent(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive field area, positive target rate, and a product nutrient percentage between 1 and 100.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Product needed per {areaUnit === 'acres' ? 'acre' : 'hectare'}:</strong> {productPerArea.toFixed(2)}
          </div>
          <div>
            <strong>Total product needed:</strong> {totalProduct.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
}
