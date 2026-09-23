import { useState } from 'react';
function carLoanPayment(loanAmount, annualRatePercent, months) {
  if (loanAmount <= 0 || months <= 0) return null;
  const r = annualRatePercent / 12 / 100;
  const payment = r === 0 ? loanAmount / months : (loanAmount * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayment = payment * months;
  const totalInterest = totalPayment - loanAmount;
  return { payment, totalPayment, totalInterest };
}
export default function CarLoanCalculator() {
  const [price, setPrice] = useState('30000');
  const [downPayment, setDownPayment] = useState('3000');
  const [tradeIn, setTradeIn] = useState('0');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('60');
  const priceNum = Number(price);
  const downNum = Number(downPayment);
  const tradeNum = Number(tradeIn);
  const rateNum = Number(rate);
  const termNum = Number(term);
  const loanAmount = priceNum - downNum - tradeNum;
  const valid =
    Number.isFinite(priceNum) && priceNum > 0 &&
    Number.isFinite(downNum) && downNum >= 0 &&
    Number.isFinite(tradeNum) && tradeNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    Number.isFinite(termNum) && termNum > 0 &&
    loanAmount > 0;
  const result = valid ? carLoanPayment(loanAmount, rateNum, termNum) : null;
  return (
    <div className="tool-page">
      <h1>Car Loan Calculator</h1>
      <p className="tool-description">
        Estimate your monthly auto loan payment, total interest, and total cost after accounting
        for a down payment and trade-in value. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Vehicle price:
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Down payment:
          <input type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Trade-in value:
          <input type="number" min={0} value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Annual interest rate (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Loan term (months):
          <input type="number" min={0} value={term} onChange={(e) => setTerm(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive vehicle price and term, non-negative down payment/trade-in/rate, and
          ensure the down payment plus trade-in doesn't exceed the vehicle price.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Loan amount:</strong> {loanAmount.toFixed(2)}
          </div>
          <div>
            <strong>Monthly payment:</strong> {result.payment.toFixed(2)}
          </div>
          <div>
            <strong>Total interest:</strong> {result.totalInterest.toFixed(2)}
          </div>
          <div>
            <strong>Total cost of loan:</strong> {result.totalPayment.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
