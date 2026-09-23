import { useEffect, useState } from 'react';
export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState('40');
  const [sellingPrice, setSellingPrice] = useState('60');
  const [result, setResult] = useState({ valid: false, profitAmount: 0, grossMarginPercent: 0, markupPercent: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/profit-margin-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { cost, sellingPrice } })
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
  }, [cost, sellingPrice]);
  const { valid, profitAmount, grossMarginPercent, markupPercent } = result;
  return (
    <div className="tool-page">
      <h1>Profit Margin Calculator</h1>
      <p className="tool-description">
        Enter a product's cost and selling price to compute gross margin %, markup %, and profit
        amount for a single product using standard formulas. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Cost per unit:
          <input type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Selling price per unit:
          <input type="number" min={0} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative cost and selling price values.
        </div>
      )}
      {!error && valid && (
        <div className="timestamp-result">
          <div>
            <strong>Profit amount:</strong> <code>{profitAmount.toFixed(2)}</code>
          </div>
          <div>
            <strong>Gross margin:</strong> <code>{grossMarginPercent.toFixed(2)}%</code> (profit as % of selling price)
          </div>
          <div>
            <strong>Markup:</strong> <code>{markupPercent.toFixed(2)}%</code> (profit as % of cost)
          </div>
        </div>
      )}
    </div>
  );
}
