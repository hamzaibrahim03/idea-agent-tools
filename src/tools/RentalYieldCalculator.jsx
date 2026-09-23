import { useEffect, useState } from 'react';
export default function RentalYieldCalculator() {
  const [price, setPrice] = useState('300000');
  const [annualRent, setAnnualRent] = useState('24000');
  const [annualExpenses, setAnnualExpenses] = useState('4000');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/rental-yield-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { price, annualRent, annualExpenses } })
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
  }, [price, annualRent, annualExpenses]);
  const valid = result?.valid ?? false;
  const grossYield = result?.grossYield ?? 0;
  const netYield = result?.netYield ?? 0;
  return (
    <div className="tool-page">
      <h1>Rental Yield Calculator</h1>
      <p className="tool-description">
        Calculate the gross and net rental yield of a property from its price, annual rental
        income, and optional annual expenses (maintenance, management fees, insurance, etc). Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Property price:
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual rental income:
          <input type="number" min={0} value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Annual expenses:
          <input type="number" min={0} value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive property price and non-negative rent/expenses.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Gross rental yield:</strong> {grossYield.toFixed(2)}%
          </div>
          <div>
            <strong>Net rental yield:</strong> {netYield.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
