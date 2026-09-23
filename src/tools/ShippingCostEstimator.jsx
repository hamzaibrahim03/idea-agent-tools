import { useEffect, useState } from 'react';
export default function ShippingCostEstimator() {
  const [distance, setDistance] = useState('250');
  const [weight, setWeight] = useState('500');
  const [baseRate, setBaseRate] = useState('50');
  const [perMile, setPerMile] = useState('1.25');
  const [perLb, setPerLb] = useState('0.05');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/freight-shipping-cost-estimator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { distance, weight, baseRate, perMile, perLb } })
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
  }, [distance, weight, baseRate, perMile, perLb]);
  const valid = result?.valid ?? false;
  const baseNum = result?.baseNum ?? 0;
  const distanceCost = result?.distanceCost ?? 0;
  const weightCost = result?.weightCost ?? 0;
  const totalCost = result?.totalCost ?? 0;
  return (
    <div className="tool-page">
      <h1>Freight Shipping Cost Estimator</h1>
      <p className="tool-description">
        Estimate freight shipping cost using a per-mile, per-pound rate model: a base rate plus a
        charge per mile of distance and per pound of weight. All rates are editable - enter your own
        carrier's or quote's rates, since this site has no live freight rate data. Runs entirely in
        your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
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
