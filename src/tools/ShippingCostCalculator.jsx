import { useMemo, useState } from 'react';
function calculate({ actualWeight, length, width, height, unit, baseRate, perUnitRate }) {
  const divisor = unit === 'in' ? 139 : 5000;
  const dimWeight = (length * width * height) / divisor;
  const billedWeight = Math.max(actualWeight, dimWeight);
  const cost = baseRate + billedWeight * perUnitRate;
  return { dimWeight, billedWeight, cost };
}
export default function ShippingCostCalculator() {
  const [unit, setUnit] = useState('in');
  const [weight, setWeight] = useState('3');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('9');
  const [height, setHeight] = useState('4');
  const [baseRate, setBaseRate] = useState('5');
  const [perUnitRate, setPerUnitRate] = useState('0.75');
  const weightNum = parseFloat(weight) || 0;
  const lengthNum = parseFloat(length) || 0;
  const widthNum = parseFloat(width) || 0;
  const heightNum = parseFloat(height) || 0;
  const baseRateNum = parseFloat(baseRate) || 0;
  const perUnitRateNum = parseFloat(perUnitRate) || 0;
  const result = useMemo(
    () =>
      calculate({
        actualWeight: weightNum,
        length: lengthNum,
        width: widthNum,
        height: heightNum,
        unit,
        baseRate: baseRateNum,
        perUnitRate: perUnitRateNum
      }),
    [weightNum, lengthNum, widthNum, heightNum, unit, baseRateNum, perUnitRateNum]
  );
  const weightUnit = unit === 'in' ? 'lb' : 'kg';
  return (
    <div className="tool-page">
      <h1>Shipping Cost Calculator</h1>
      <p className="tool-description">
        Enter your package weight, dimensions, and a simple rate table (base rate + per-unit rate)
        to estimate shipping cost. Also computes dimensional weight using the standard carrier
        formula and bills on the greater of actual vs. dimensional weight, as real carriers do. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Units:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="in">inches / lb</option>
            <option value="cm">centimeters / kg</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sc-weight">Actual weight ({weightUnit})</label>
          <input id="sc-weight" type="number" min={0} step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-length">Length ({unit})</label>
          <input id="sc-length" type="number" min={0} step="0.1" value={length} onChange={(e) => setLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-width">Width ({unit})</label>
          <input id="sc-width" type="number" min={0} step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-height">Height ({unit})</label>
          <input id="sc-height" type="number" min={0} step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-base">Base rate ($)</label>
          <input id="sc-base" type="number" min={0} step="0.01" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-per">Rate per {weightUnit} ($)</label>
          <input id="sc-per" type="number" min={0} step="0.01" value={perUnitRate} onChange={(e) => setPerUnitRate(e.target.value)} />
        </div>
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Dimensional weight:</strong> {result.dimWeight.toFixed(2)} {weightUnit}
        </span>
        <span>
          <strong>Billed weight (greater of the two):</strong> {result.billedWeight.toFixed(2)} {weightUnit}
        </span>
        <span>
          <strong>Estimated shipping cost:</strong> ${result.cost.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
