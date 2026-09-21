import { useState } from 'react';
function monthsToGoal(target, current, monthlyContribution, annualRatePercent) {
  if (target <= current) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    if (monthlyContribution <= 0) return null;
    return Math.ceil((target - current) / monthlyContribution);
  }
  let balance = current;
  let months = 0;
  const maxMonths = 1200;
  while (balance < target && months < maxMonths) {
    balance = balance * (1 + r) + monthlyContribution;
    months += 1;
  }
  if (balance < target) return null;
  return months;
}
export default function SavingsGoalCalculator() {
  const [target, setTarget] = useState('10000');
  const [current, setCurrent] = useState('1000');
  const [monthly, setMonthly] = useState('200');
  const [rate, setRate] = useState('4');
  const targetNum = Number(target);
  const currentNum = Number(current);
  const monthlyNum = Number(monthly);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(targetNum) && targetNum > 0 &&
    Number.isFinite(currentNum) && currentNum >= 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0;
  const months = valid ? monthsToGoal(targetNum, currentNum, monthlyNum, rateNum) : null;
  const years = months !== null ? Math.floor(months / 12) : null;
  const remMonths = months !== null ? months % 12 : null;
  return (
    <div className="tool-page">
      <h1>Savings Goal Calculator</h1>
      <p className="tool-description">
        Work out how many months it will take to reach a savings target, given what you already
        have saved, a regular monthly contribution, and an expected annual interest rate. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Target amount:
          <input type="number" min={0} value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Current savings:
          <input type="number" min={0} value={current} onChange={(e) => setCurrent(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Monthly contribution:
          <input type="number" min={0} value={monthly} onChange={(e) => setMonthly(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual interest rate (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive target, and non-negative current savings, contribution, and rate.
        </div>
      )}
      {valid && months === null && (
        <div className="tool-error">
          <strong>Error:</strong> With a $0 monthly contribution and no interest, this goal can never be reached. Add a monthly contribution.
        </div>
      )}
      {months !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Time to reach goal:</strong> {months} month{months === 1 ? '' : 's'} ({years} year{years === 1 ? '' : 's'}
            {remMonths ? `, ${remMonths} month${remMonths === 1 ? '' : 's'}` : ''})
          </div>
          <div>
            <strong>Total contributed:</strong> {(currentNum + monthlyNum * months).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
