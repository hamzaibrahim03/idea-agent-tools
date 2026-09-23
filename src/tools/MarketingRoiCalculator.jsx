import { useEffect, useState } from 'react';
export default function MarketingRoiCalculator() {
  const [spend, setSpend] = useState('1000');
  const [revenue, setRevenue] = useState('3000');
  const [customers, setCustomers] = useState('20');
  const [spendValid, setSpendValid] = useState(true);
  const [result, setResult] = useState(null);
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/marketing-roi-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { spend, revenue, customers } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setSpendValid(data.spendValid);
            setResult(data.result);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [spend, revenue, customers]);
  return (
    <div className="tool-page">
      <h1>Marketing ROI Calculator</h1>
      <p className="tool-description">
        Enter your marketing spend, the revenue it generated, and (optionally) the number of
        customers acquired to calculate ROI %, ROAS (return on ad spend), and cost per acquisition
        using standard marketing formulas.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="roi-spend">Marketing spend ($)</label>
          <input id="roi-spend" type="number" min={0} step="0.01" value={spend} onChange={(e) => setSpend(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-revenue">Revenue generated ($)</label>
          <input id="roi-revenue" type="number" min={0} step="0.01" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-customers">Customers acquired (optional)</label>
          <input id="roi-customers" type="number" min={0} step="1" value={customers} onChange={(e) => setCustomers(e.target.value)} />
        </div>
      </div>
      {!spendValid || !result ? (
        <div className="tool-error">Enter a marketing spend greater than 0.</div>
      ) : (
        <div className="timestamp-result">
          <span>
            <strong>ROI:</strong> {result.roiPercent.toFixed(1)}%
          </span>
          <span>
            <strong>ROAS:</strong> {result.roas.toFixed(2)}x (every $1 spent returned ${result.roas.toFixed(2)})
          </span>
          <span>
            <strong>Cost per acquisition:</strong>{' '}
            {result.cpa !== null ? `$${result.cpa.toFixed(2)}` : 'Enter customers acquired to calculate'}
          </span>
        </div>
      )}
    </div>
  );
}
