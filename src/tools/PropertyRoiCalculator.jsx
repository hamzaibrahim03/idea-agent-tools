import { useEffect, useState } from 'react';
export default function PropertyRoiCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('300000');
  const [totalInvestment, setTotalInvestment] = useState('75000');
  const [annualRent, setAnnualRent] = useState('24000');
  const [annualExpenses, setAnnualExpenses] = useState('6000');
  const [salePrice, setSalePrice] = useState('350000');
  const [holdingYears, setHoldingYears] = useState('5');
  const [result, setResult] = useState({ valid: false, annualCashFlow: 0, cashOnCashReturn: 0, totalCashFlow: 0, capitalGain: 0, totalProfit: 0, totalRoi: 0, annualizedRoi: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/property-roi-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { purchasePrice, totalInvestment, annualRent, annualExpenses, salePrice, holdingYears } })
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
  }, [purchasePrice, totalInvestment, annualRent, annualExpenses, salePrice, holdingYears]);
  const { valid, annualCashFlow, cashOnCashReturn, capitalGain, totalProfit, totalRoi, annualizedRoi } = result;
  return (
    <div className="tool-page">
      <h1>Property ROI Calculator</h1>
      <p className="tool-description">
        Estimate the cash-on-cash return and total return on investment for a rental property over
        a holding period, combining rental cash flow with capital gain at sale. Runs entirely in
        your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="roi-purchase">Purchase price</label>
          <input id="roi-purchase" type="number" min={0} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-investment">Total cash invested (down payment + closing costs + renovation)</label>
          <input id="roi-investment" type="number" min={0} value={totalInvestment} onChange={(e) => setTotalInvestment(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-rent">Annual rental income</label>
          <input id="roi-rent" type="number" min={0} value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-expenses">Annual expenses</label>
          <input id="roi-expenses" type="number" min={0} value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-sale">Expected sale price</label>
          <input id="roi-sale" type="number" min={0} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-years">Holding period (years)</label>
          <input id="roi-years" type="number" min={0} value={holdingYears} onChange={(e) => setHoldingYears(e.target.value)} />
        </div>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive purchase price and cash invested, non-negative rent/expenses/sale price, and a positive holding period.
        </div>
      )}
      {!error && valid && (
        <div className="timestamp-result">
          <div>
            <strong>Annual cash flow:</strong> {annualCashFlow.toFixed(2)}
          </div>
          <div>
            <strong>Cash-on-cash return (year 1):</strong> {cashOnCashReturn.toFixed(2)}%
          </div>
          <div>
            <strong>Capital gain at sale:</strong> {capitalGain.toFixed(2)}
          </div>
          <div>
            <strong>Total profit over holding period:</strong> {totalProfit.toFixed(2)}
          </div>
          <div>
            <strong>Total ROI:</strong> {totalRoi.toFixed(2)}%
          </div>
          <div>
            <strong>Annualized ROI (approx.):</strong> {annualizedRoi.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
