import { useState } from 'react';
const RATE_RANGES = {
  residential: {
    economy: { low: 100, high: 150 },
    standard: { low: 150, high: 225 },
    premium: { low: 225, high: 400 }
  },
  commercial: {
    economy: { low: 150, high: 200 },
    standard: { low: 200, high: 300 },
    premium: { low: 300, high: 500 }
  }
};
function averageRate(projectType, tier) {
  const range = RATE_RANGES[projectType][tier];
  return (range.low + range.high) / 2;
}
export default function ConstructionCostEstimator() {
  const [projectType, setProjectType] = useState('residential');
  const [tier, setTier] = useState('standard');
  const [sqft, setSqft] = useState('2000');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState('180');
  const [laborShare, setLaborShare] = useState('40');
  const sqftNum = Number(sqft);
  const customRateNum = Number(customRate);
  const laborShareNum = Number(laborShare);
  const range = RATE_RANGES[projectType][tier];
  const rate = useCustomRate ? customRateNum : averageRate(projectType, tier);
  const valid =
    Number.isFinite(sqftNum) && sqftNum > 0 &&
    Number.isFinite(rate) && rate > 0 &&
    Number.isFinite(laborShareNum) && laborShareNum >= 0 && laborShareNum <= 100;
  const totalLow = valid ? sqftNum * (useCustomRate ? rate : range.low) : null;
  const totalHigh = valid ? sqftNum * (useCustomRate ? rate : range.high) : null;
  const totalMid = valid ? sqftNum * rate : null;
  const laborCost = totalMid !== null ? totalMid * (laborShareNum / 100) : null;
  const materialCost = totalMid !== null ? totalMid - laborCost : null;
  return (
    <div className="tool-page">
      <h1>Construction Cost Estimator</h1>
      <p className="tool-description">
        Estimate total construction cost from square footage and a quality tier, using published
        rough regional-average per-sq-ft cost ranges. Actual costs vary hugely by location, labor
        market, and site conditions - override the per-sq-ft rate with your own regional figure for
        a better estimate. This is a planning-stage estimate, not a substitute for a licensed
        contractor's quote. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Project type:
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>
        <label>
          Quality tier:
          <select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={useCustomRate} onChange={(e) => setUseCustomRate(e.target.checked)} />
          Use my own rate
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sqft">Square footage</label>
          <input id="sqft" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="labor-share">Labor share of total cost (%)</label>
          <input
            id="labor-share"
            type="number"
            min={0}
            max={100}
            value={laborShare}
            onChange={(e) => setLaborShare(e.target.value)}
          />
        </div>
        {useCustomRate && (
          <div className="tool-panel">
            <label htmlFor="custom-rate">Your regional rate ($/sq ft)</label>
            <input id="custom-rate" type="number" min={0} value={customRate} onChange={(e) => setCustomRate(e.target.value)} />
          </div>
        )}
      </div>
      {!useCustomRate && (
        <p className="tool-placeholder">
          Published range for {projectType} / {tier}: ${range.low}-${range.high} per sq ft (using midpoint $
          {rate.toFixed(0)}/sq ft below).
        </p>
      )}
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive square footage, a positive rate, and a labor share between 0 and 100%.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          {!useCustomRate && (
            <div>
              <strong>Estimated range:</strong> ${totalLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - $
              {totalHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          )}
          <div>
            <strong>Estimated total (at ${rate.toFixed(0)}/sq ft):</strong> $
            {totalMid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div>
            <strong>Estimated labor cost:</strong> ${laborCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div>
            <strong>Estimated material cost:</strong> ${materialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      )}
    </div>
  );
}
