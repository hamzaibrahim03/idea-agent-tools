import { useState } from 'react';
function minimumHourlyRate(desiredIncome, billableHoursPerWeek, weeksPerYear, annualOverhead) {
  const billableHoursPerYear = billableHoursPerWeek * weeksPerYear;
  if (billableHoursPerYear <= 0) return null;
  const requiredRevenue = desiredIncome + annualOverhead;
  return { rate: requiredRevenue / billableHoursPerYear, billableHoursPerYear, requiredRevenue };
}
export default function FreelanceRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState('80000');
  const [billableHours, setBillableHours] = useState('25');
  const [weeksPerYear, setWeeksPerYear] = useState('48');
  const [overhead, setOverhead] = useState('10000');
  const incomeNum = Number(desiredIncome);
  const hoursNum = Number(billableHours);
  const weeksNum = Number(weeksPerYear);
  const overheadNum = Number(overhead);
  const valid =
    Number.isFinite(incomeNum) && incomeNum > 0 &&
    Number.isFinite(hoursNum) && hoursNum > 0 &&
    Number.isFinite(weeksNum) && weeksNum > 0 && weeksNum <= 52 &&
    Number.isFinite(overheadNum) && overheadNum >= 0;
  const result = valid ? minimumHourlyRate(incomeNum, hoursNum, weeksNum, overheadNum) : null;
  return (
    <div className="tool-page">
      <h1>Freelance Rate Calculator</h1>
      <p className="tool-description">
        Calculate the minimum hourly rate you need to charge to hit a desired annual income, based
        on your billable hours per week, weeks worked per year, and business overhead or
        expenses. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Desired annual income:
          <input type="number" min={0} value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Billable hours/week:
          <input type="number" min={0} value={billableHours} onChange={(e) => setBillableHours(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Weeks worked/year:
          <input
            type="number"
            min={0}
            max={52}
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
            style={{ width: '80px' }}
          />
        </label>
        <label>
          Annual overhead/expenses:
          <input type="number" min={0} value={overhead} onChange={(e) => setOverhead(e.target.value)} style={{ width: '110px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive income, positive hours/week, weeks/year between 1 and 52, and a
          non-negative overhead amount.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Minimum hourly rate:</strong> {result.rate.toFixed(2)}
          </div>
          <div>
            <strong>Billable hours/year:</strong> {result.billableHoursPerYear.toLocaleString()}
          </div>
          <div>
            <strong>Required annual revenue:</strong> {result.requiredRevenue.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
