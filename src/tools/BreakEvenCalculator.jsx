import { useState } from 'react';
export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('10000');
  const [variableCost, setVariableCost] = useState('20');
  const [price, setPrice] = useState('50');
  const fixedNum = Number(fixedCosts);
  const variableNum = Number(variableCost);
  const priceNum = Number(price);
  const contributionMargin = priceNum - variableNum;
  const valid =
    Number.isFinite(fixedNum) && fixedNum >= 0 &&
    Number.isFinite(variableNum) && variableNum >= 0 &&
    Number.isFinite(priceNum) && priceNum > 0 &&
    contributionMargin > 0;
  const breakEvenUnits = valid ? fixedNum / contributionMargin : 0;
  const breakEvenRevenue = valid ? breakEvenUnits * priceNum : 0;
  const contributionMarginRatio = valid ? (contributionMargin / priceNum) * 100 : 0;
  return (
    <div className="tool-page">
      <h1>Break-Even Calculator</h1>
      <p className="tool-description">
        Calculate the break-even point in units and revenue given fixed costs, variable cost per
        unit, and price per unit, using the standard break-even formula (fixed costs divided by
        contribution margin per unit). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Fixed costs:
          <input type="number" min={0} value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Variable cost per unit:
          <input type="number" min={0} value={variableCost} onChange={(e) => setVariableCost(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Price per unit:
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Price per unit must be greater than variable cost per unit (a positive contribution margin), and costs must be non-negative.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Contribution margin per unit:</strong> <code>{contributionMargin.toFixed(2)}</code> ({contributionMarginRatio.toFixed(2)}%)
          </div>
          <div>
            <strong>Break-even point:</strong> <code>{Math.ceil(breakEvenUnits)}</code> units
          </div>
          <div>
            <strong>Break-even revenue:</strong> <code>{breakEvenRevenue.toFixed(2)}</code>
          </div>
        </div>
      )}
    </div>
  );
}
