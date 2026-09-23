import { useEffect, useState } from 'react';
export default function ShippingCostCalculator() {
  const [unit, setUnit] = useState('in');
  const [weight, setWeight] = useState('3');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('9');
  const [height, setHeight] = useState('4');
  const [baseRate, setBaseRate] = useState('5');
  const [perUnitRate, setPerUnitRate] = useState('0.75');
  const [result, setResult] = useState({ dimWeight: 0, billedWeight: 0, cost: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/shipping-cost-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { actualWeight: weight, length, width, height, unit, baseRate, perUnitRate } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [weight, length, width, height, unit, baseRate, perUnitRate]);
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
      {error && <div className="agent-error">{error}</div>}
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
