import { useEffect, useState } from 'react';
export default function MachineryCostCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('120000');
  const [salvageValue, setSalvageValue] = useState('20000');
  const [usefulLifeYears, setUsefulLifeYears] = useState('10');
  const [annualMaintenance, setAnnualMaintenance] = useState('3500');
  const [annualHours, setAnnualHours] = useState('400');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/machinery-cost-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { purchasePrice, salvageValue, usefulLifeYears, annualMaintenance, annualHours } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [purchasePrice, salvageValue, usefulLifeYears, annualMaintenance, annualHours]);
  return (
    <div className="tool-page">
      <h1>Machinery Cost Calculator</h1>
      <p className="tool-description">
        Enter a machine's purchase price, expected useful life, salvage value, and annual maintenance
        cost to compute straight-line depreciation per year and cost per hour of use based on
        estimated annual usage hours.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="mcc-price">Purchase price</label>
          <input id="mcc-price" type="number" min={0} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-salvage">Salvage value (end of life)</label>
          <input id="mcc-salvage" type="number" min={0} value={salvageValue} onChange={(e) => setSalvageValue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-life">Useful life (years)</label>
          <input id="mcc-life" type="number" min={0} value={usefulLifeYears} onChange={(e) => setUsefulLifeYears(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-maint">Annual maintenance cost</label>
          <input id="mcc-maint" type="number" min={0} value={annualMaintenance} onChange={(e) => setAnnualMaintenance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-hours">Estimated annual hours of use</label>
          <input id="mcc-hours" type="number" min={0} value={annualHours} onChange={(e) => setAnnualHours(e.target.value)} />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Annual depreciation (straight-line):</strong> ${result.annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Total annual cost (depreciation + maintenance):</strong> ${result.totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Cost per hour of use:</strong> ${result.costPerHour.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
