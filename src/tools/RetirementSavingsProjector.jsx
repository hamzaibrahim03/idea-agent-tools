import { useState } from 'react';
function projectRetirement(currentSavings, monthlyContribution, annualRatePercent, years) {
  const r = annualRatePercent / 100 / 12;
  const months = years * 12;
  const lumpSumGrowth = currentSavings * (1 + r) ** months;
  const contributionGrowth =
    r === 0 ? monthlyContribution * months : monthlyContribution * (((1 + r) ** months - 1) / r);
  const projectedBalance = lumpSumGrowth + contributionGrowth;
  const totalContributed = currentSavings + monthlyContribution * months;
  const totalGrowth = projectedBalance - totalContributed;
  return { projectedBalance, totalContributed, totalGrowth };
}
export default function RetirementSavingsProjector() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('20000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [rate, setRate] = useState('7');
  const currentAgeNum = Number(currentAge);
  const retirementAgeNum = Number(retirementAge);
  const currentSavingsNum = Number(currentSavings);
  const monthlyNum = Number(monthlyContribution);
  const rateNum = Number(rate);
  const years = retirementAgeNum - currentAgeNum;
  const valid =
    Number.isFinite(currentAgeNum) && currentAgeNum > 0 &&
    Number.isFinite(retirementAgeNum) &&
    Number.isFinite(currentSavingsNum) && currentSavingsNum >= 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    years > 0;
  const result = valid ? projectRetirement(currentSavingsNum, monthlyNum, rateNum, years) : null;
  return (
    <div className="tool-page">
      <h1>Retirement Savings Projector</h1>
      <p className="tool-description">
        Project your retirement account balance using your current savings, a regular monthly
        contribution, and an expected annual rate of return, compounded monthly. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Current age:
          <input type="number" min={0} value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Retirement age:
          <input type="number" min={0} value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Current savings:
          <input type="number" min={0} value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Monthly contribution:
          <input
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            style={{ width: '110px' }}
          />
        </label>
        <label>
          Expected annual return (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Retirement age must be greater than current age, and other fields must be non-negative.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Years until retirement:</strong> {years}
          </div>
          <div>
            <strong>Projected balance:</strong> {result.projectedBalance.toFixed(2)}
          </div>
          <div>
            <strong>Total contributed:</strong> {result.totalContributed.toFixed(2)}
          </div>
          <div>
            <strong>Total investment growth:</strong> {result.totalGrowth.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
