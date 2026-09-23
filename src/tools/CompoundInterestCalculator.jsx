import { useState } from 'react';
function compoundInterest(principal, annualRatePercent, years, compoundsPerYear, monthlyContribution) {
  const r = annualRatePercent / 100;
  const n = compoundsPerYear;
  const periods = years * n;
  const ratePerPeriod = r / n;
  const principalGrowth = principal * (1 + ratePerPeriod) ** periods;
  let contributionGrowth = 0;
  if (monthlyContribution > 0) {
    const contributionPerPeriod = (monthlyContribution * 12) / n;
    contributionGrowth = ratePerPeriod === 0
      ? contributionPerPeriod * periods
      : contributionPerPeriod * (((1 + ratePerPeriod) ** periods - 1) / ratePerPeriod);
  }
  const finalBalance = principalGrowth + contributionGrowth;
  const totalContributed = principal + monthlyContribution * 12 * years;
  const totalInterest = finalBalance - totalContributed;
  return { finalBalance, totalContributed, totalInterest };
}
export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('10');
  const [compounds, setCompounds] = useState('12');
  const [monthly, setMonthly] = useState('0');
  const principalNum = Number(principal);
  const rateNum = Number(rate);
  const yearsNum = Number(years);
  const compoundsNum = Number(compounds);
  const monthlyNum = Number(monthly);
  const valid =
    Number.isFinite(principalNum) && principalNum >= 0 &&
    Number.isFinite(rateNum) &&
    Number.isFinite(yearsNum) && yearsNum > 0 &&
    Number.isFinite(compoundsNum) && compoundsNum > 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0;
  const result = valid ? compoundInterest(principalNum, rateNum, yearsNum, compoundsNum, monthlyNum) : null;
  return (
    <div className="tool-page">
      <h1>Compound Interest Calculator</h1>
      <p className="tool-description">
        Calculate how an investment grows over time with compound interest, including optional
        regular monthly contributions. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Initial amount:
          <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual rate (%):
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Years:
          <input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Compounds/year:
          <select value={compounds} onChange={(e) => setCompounds(e.target.value)}>
            <option value="1">Annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </select>
        </label>
        <label>
          Monthly contribution:
          <input type="number" min={0} value={monthly} onChange={(e) => setMonthly(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative initial amount, a positive number of years, and non-negative contribution.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Final balance:</strong> {result.finalBalance.toFixed(2)}
          </div>
          <div>
            <strong>Total contributed:</strong> {result.totalContributed.toFixed(2)}
          </div>
          <div>
            <strong>Total interest earned:</strong> {result.totalInterest.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
