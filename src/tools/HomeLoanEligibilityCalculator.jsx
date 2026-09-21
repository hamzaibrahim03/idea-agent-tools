import { useState } from 'react';
function maxLoanFromPayment(payment, annualRatePercent, months) {
  if (payment <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return payment * months;
  return (payment * ((1 + r) ** months - 1)) / (r * (1 + r) ** months);
}
export default function HomeLoanEligibilityCalculator() {
  const [income, setIncome] = useState('6000');
  const [existingDebt, setExistingDebt] = useState('500');
  const [dtiRatio, setDtiRatio] = useState('36');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const incomeNum = Number(income);
  const debtNum = Number(existingDebt);
  const dtiNum = Number(dtiRatio);
  const rateNum = Number(rate);
  const yearsNum = Number(years);
  const months = yearsNum * 12;
  const valid =
    Number.isFinite(incomeNum) && incomeNum > 0 &&
    Number.isFinite(debtNum) && debtNum >= 0 &&
    Number.isFinite(dtiNum) && dtiNum > 0 && dtiNum <= 100 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    Number.isFinite(yearsNum) && yearsNum > 0;
  const maxTotalDebtPayment = valid ? incomeNum * (dtiNum / 100) : 0;
  const maxMortgagePayment = valid ? Math.max(0, maxTotalDebtPayment - debtNum) : 0;
  const maxLoanAmount = valid ? maxLoanFromPayment(maxMortgagePayment, rateNum, months) : 0;
  return (
    <div className="tool-page">
      <h1>Home Loan Eligibility Calculator</h1>
      <p className="tool-description">
        Estimate the maximum monthly mortgage payment and rough loan amount you could qualify for,
        based on your income, existing debts, and a target debt-to-income (DTI) ratio. This is a
        rough estimate - actual lender approval depends on many other factors. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Monthly income:
          <input type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Existing monthly debt payments:
          <input type="number" min={0} value={existingDebt} onChange={(e) => setExistingDebt(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Max debt-to-income ratio (%):
          <input type="number" min={0} max={100} value={dtiRatio} onChange={(e) => setDtiRatio(e.target.value)} style={{ width: '70px' }} />
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
          <strong>Error:</strong> Enter a positive income, a non-negative existing debt, a DTI ratio between 0-100%, a non-negative rate, and a positive term.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Max total debt payment allowed:</strong> {maxTotalDebtPayment.toFixed(2)} /month
          </div>
          <div>
            <strong>Max affordable mortgage payment:</strong> {maxMortgagePayment.toFixed(2)} /month
          </div>
          <div>
            <strong>Estimated max loan amount:</strong> {maxLoanAmount.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
