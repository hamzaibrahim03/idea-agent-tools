import { useState } from 'react';
export default function RentalYieldCalculator() {
  const [price, setPrice] = useState('300000');
  const [annualRent, setAnnualRent] = useState('24000');
  const [annualExpenses, setAnnualExpenses] = useState('4000');
  const priceNum = Number(price);
  const rentNum = Number(annualRent);
  const expensesNum = Number(annualExpenses);
  const valid = Number.isFinite(priceNum) && priceNum > 0 && Number.isFinite(rentNum) && rentNum >= 0 && Number.isFinite(expensesNum) && expensesNum >= 0;
  const grossYield = valid ? (rentNum / priceNum) * 100 : 0;
  const netYield = valid ? ((rentNum - expensesNum) / priceNum) * 100 : 0;
  return (
    <div className="tool-page">
      <h1>Rental Yield Calculator</h1>
      <p className="tool-description">
        Calculate the gross and net rental yield of a property from its price, annual rental
        income, and optional annual expenses (maintenance, management fees, insurance, etc). Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Property price:
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual rental income:
          <input type="number" min={0} value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Annual expenses:
          <input type="number" min={0} value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive property price and non-negative rent/expenses.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Gross rental yield:</strong> {grossYield.toFixed(2)}%
          </div>
          <div>
            <strong>Net rental yield:</strong> {netYield.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
