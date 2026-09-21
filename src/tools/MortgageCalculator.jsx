import { useState } from 'react';
function mortgagePayment(principal, annualRatePercent, months) {
  if (principal <= 0 || months <= 0) return null;
  const r = annualRatePercent / 100 / 12;
  const monthlyPayment = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;
  return { monthlyPayment, totalPaid, totalInterest };
}
export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('300000');
  const [downPayment, setDownPayment] = useState('60000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const priceNum = Number(homePrice);
  const downNum = Number(downPayment);
  const rateNum = Number(rate);
  const yearsNum = Number(years);
  const months = yearsNum * 12;
  const loanAmount = priceNum - downNum;
  const valid =
    Number.isFinite(priceNum) && priceNum > 0 &&
    Number.isFinite(downNum) && downNum >= 0 && downNum < priceNum &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    Number.isFinite(yearsNum) && yearsNum > 0;
  const result = valid ? mortgagePayment(loanAmount, rateNum, months) : null;
  return (
    <div className="tool-page">
      <h1>Mortgage Calculator</h1>
      <p className="tool-description">
        Estimate your monthly mortgage payment (principal and interest) from a home price, down
        payment, interest rate, and loan term, using the standard fixed-rate amortization formula.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Home price:
          <input type="number" min={0} value={homePrice} onChange={(e) => setHomePrice(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Down payment:
          <input type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Interest rate (%/yr):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Loan term (years):
          <input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive home price, a down payment less than the home price, a non-negative rate, and a positive term.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Loan amount:</strong> {loanAmount.toFixed(2)}
          </div>
          <div>
            <strong>Monthly payment (P&amp;I):</strong> {result.monthlyPayment.toFixed(2)}
          </div>
          <div>
            <strong>Total interest paid:</strong> {result.totalInterest.toFixed(2)}
          </div>
          <div>
            <strong>Total cost (loan + interest):</strong> {result.totalPaid.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
