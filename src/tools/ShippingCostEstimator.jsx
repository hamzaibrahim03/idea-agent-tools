import { useState } from 'react';
export default function ShippingCostEstimator() {
  const [distance, setDistance] = useState('250');
  const [weight, setWeight] = useState('500');
  const [baseRate, setBaseRate] = useState('50');
  const [perMile, setPerMile] = useState('1.25');
  const [perLb, setPerLb] = useState('0.05');
  const distanceNum = Number(distance);
  const weightNum = Number(weight);
  const baseNum = Number(baseRate);
  const perMileNum = Number(perMile);
  const perLbNum = Number(perLb);
  const valid = [distanceNum, weightNum, baseNum, perMileNum, perLbNum].every((n) => Number.isFinite(n) && n >= 0);
  const distanceCost = valid ? distanceNum * perMileNum : null;
  const weightCost = valid ? weightNum * perLbNum : null;
  const totalCost = valid ? baseNum + distanceCost + weightCost : null;
  return (
    <div className="tool-page">
      <h1>Freight Shipping Cost Estimator</h1>
      <p className="tool-description">
        Estimate freight shipping cost using a per-mile, per-pound rate model: a base rate plus a
        charge per mile of distance and per pound of weight. All rates are editable - enter your own
        carrier's or quote's rates, since this site has no live freight rate data. Runs entirely in
        your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sce-distance">Distance (miles)</label>
          <input id="sce-distance" type="number" min={0} value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sce-weight">Weight (lbs)</label>
          <input id="sce-weight" type="number" min={0} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sce-base">Base rate ($)</label>
          <input id="sce-base" type="number" min={0} step="0.01" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sce-permile">Rate per mile ($)</label>
          <input id="sce-permile" type="number" min={0} step="0.01" value={perMile} onChange={(e) => setPerMile(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sce-perlb">Rate per pound ($)</label>
          <input id="sce-perlb" type="number" min={0} step="0.01" value={perLb} onChange={(e) => setPerLb(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative values for all fields.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Base charge:</strong> ${baseNum.toFixed(2)}
          </div>
          <div>
            <strong>Distance charge:</strong> ${distanceCost.toFixed(2)}
          </div>
          <div>
            <strong>Weight charge:</strong> ${weightCost.toFixed(2)}
          </div>
          <div>
            <strong>Total freight cost:</strong> ${totalCost.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
