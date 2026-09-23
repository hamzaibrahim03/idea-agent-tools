import { useState } from 'react';
function emiFormula(principal, annualRatePercent, months) {
  if (principal <= 0 || months <= 0) return null;
  const r = annualRatePercent / 12 / 100;
  const emi = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}
export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('10');
  const [term, setTerm] = useState('12');
  const [termUnit, setTermUnit] = useState('months');
  const principalNum = Number(principal);
  const rateNum = Number(rate);
  const termNum = Number(term);
  const months = termUnit === 'years' ? termNum * 12 : termNum;
  const valid = Number.isFinite(principalNum) && principalNum > 0 && Number.isFinite(rateNum) && rateNum >= 0 && Number.isFinite(months) && months > 0;
  const result = valid ? emiFormula(principalNum, rateNum, months) : null;
  return (
    <div className="tool-page">
      <h1>Loan EMI Calculator</h1>
      <p className="tool-description">
        Calculate the Equated Monthly Installment (EMI) for a loan, along with total interest and
        total payment, using the standard reducing-balance amortization formula. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Loan amount:
          <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual interest rate (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Loan term:
          <input type="number" min={0} value={term} onChange={(e) => setTerm(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Unit:
          <select value={termUnit} onChange={(e) => setTermUnit(e.target.value)}>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive loan amount, a non-negative interest rate, and a positive term.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Monthly EMI:</strong> {result.emi.toFixed(2)}
          </div>
          <div>
            <strong>Total interest:</strong> {result.totalInterest.toFixed(2)}
          </div>
          <div>
            <strong>Total payment:</strong> {result.totalPayment.toFixed(2)}
          </div>
          <div>
            <strong>Number of installments:</strong> {months}
          </div>
        </div>
      )}
    </div>
  );
}
