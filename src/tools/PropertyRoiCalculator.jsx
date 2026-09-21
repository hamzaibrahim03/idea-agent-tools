import { useState } from 'react';
export default function PropertyRoiCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('300000');
  const [totalInvestment, setTotalInvestment] = useState('75000');
  const [annualRent, setAnnualRent] = useState('24000');
  const [annualExpenses, setAnnualExpenses] = useState('6000');
  const [salePrice, setSalePrice] = useState('350000');
  const [holdingYears, setHoldingYears] = useState('5');
  const purchaseNum = Number(purchasePrice);
  const investmentNum = Number(totalInvestment);
  const rentNum = Number(annualRent);
  const expensesNum = Number(annualExpenses);
  const saleNum = Number(salePrice);
  const yearsNum = Number(holdingYears);
  const valid =
    Number.isFinite(purchaseNum) && purchaseNum > 0 &&
    Number.isFinite(investmentNum) && investmentNum > 0 &&
    Number.isFinite(rentNum) && rentNum >= 0 &&
    Number.isFinite(expensesNum) && expensesNum >= 0 &&
    Number.isFinite(saleNum) && saleNum >= 0 &&
    Number.isFinite(yearsNum) && yearsNum > 0;
  const annualCashFlow = valid ? rentNum - expensesNum : 0;
  const cashOnCashReturn = valid ? (annualCashFlow / investmentNum) * 100 : 0;
  const totalCashFlow = valid ? annualCashFlow * yearsNum : 0;
  const capitalGain = valid ? saleNum - purchaseNum : 0;
  const totalProfit = valid ? totalCashFlow + capitalGain : 0;
  const totalRoi = valid ? (totalProfit / investmentNum) * 100 : 0;
  const annualizedRoi = valid && yearsNum > 0 ? totalRoi / yearsNum : 0;
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
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive purchase price and cash invested, non-negative rent/expenses/sale price, and a positive holding period.
        </div>
      )}
      {valid && (
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
