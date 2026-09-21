import { useState } from 'react';
export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState('40');
  const [sellingPrice, setSellingPrice] = useState('60');
  const costNum = Number(cost);
  const priceNum = Number(sellingPrice);
  const valid = Number.isFinite(costNum) && costNum >= 0 && Number.isFinite(priceNum) && priceNum >= 0;
  const profitAmount = valid ? priceNum - costNum : 0;
  const grossMarginPercent = valid && priceNum > 0 ? (profitAmount / priceNum) * 100 : 0;
  const markupPercent = valid && costNum > 0 ? (profitAmount / costNum) * 100 : 0;
  return (
    <div className="tool-page">
      <h1>Profit Margin Calculator</h1>
      <p className="tool-description">
        Enter a product's cost and selling price to compute gross margin %, markup %, and profit
        amount for a single product using standard formulas. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Cost per unit:
          <input type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Selling price per unit:
          <input type="number" min={0} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative cost and selling price values.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Profit amount:</strong> <code>{profitAmount.toFixed(2)}</code>
          </div>
          <div>
            <strong>Gross margin:</strong> <code>{grossMarginPercent.toFixed(2)}%</code> (profit as % of selling price)
          </div>
          <div>
            <strong>Markup:</strong> <code>{markupPercent.toFixed(2)}%</code> (profit as % of cost)
          </div>
        </div>
      )}
    </div>
  );
}
