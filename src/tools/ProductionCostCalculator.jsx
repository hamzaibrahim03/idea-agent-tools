import { useEffect, useState } from 'react';
export default function ProductionCostCalculator() {
  const [material, setMaterial] = useState('4.50');
  const [labor, setLabor] = useState('2.25');
  const [overhead, setOverhead] = useState('1.10');
  const [units, setUnits] = useState('1000');
  const [result, setResult] = useState({ valid: false, costPerUnit: null, totalCost: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/production-cost-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { material, labor, overhead, units } })
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
  }, [material, labor, overhead, units]);
  const { valid, costPerUnit, totalCost } = result;
  return (
    <div className="tool-page">
      <h1>Production Cost Calculator</h1>
      <p className="tool-description">
        Enter your raw material, labor, and overhead cost per unit along with the number of units to
        produce, and get the total production cost and cost per unit. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pcc-material">Raw material cost per unit</label>
          <input id="pcc-material" type="number" min={0} step="0.01" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-labor">Labor cost per unit</label>
          <input id="pcc-labor" type="number" min={0} step="0.01" value={labor} onChange={(e) => setLabor(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-overhead">Overhead cost per unit</label>
          <input id="pcc-overhead" type="number" min={0} step="0.01" value={overhead} onChange={(e) => setOverhead(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-units">Number of units</label>
          <input id="pcc-units" type="number" min={0} value={units} onChange={(e) => setUnits(e.target.value)} />
        </div>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative costs and a positive number of units.
        </div>
      )}
      {!error && valid && (
        <div className="timestamp-result">
          <div>
            <strong>Cost per unit:</strong> ${costPerUnit.toFixed(2)}
          </div>
          <div>
            <strong>Total production cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
}
