import { useState } from 'react';
export default function ProductPricingCalculator() {
  const [cost, setCost] = useState('20');
  const [marginPercent, setMarginPercent] = useState('40');
  const [shipping, setShipping] = useState('0');
  const [platformFeePercent, setPlatformFeePercent] = useState('0');
  const costNum = Number(cost);
  const marginNum = Number(marginPercent);
  const shippingNum = Number(shipping);
  const feeNum = Number(platformFeePercent);
  const valid =
    Number.isFinite(costNum) && costNum >= 0 &&
    Number.isFinite(marginNum) && marginNum >= 0 && marginNum < 100 &&
    Number.isFinite(shippingNum) && shippingNum >= 0 &&
    Number.isFinite(feeNum) && feeNum >= 0 && feeNum < 100;
  const baseCost = costNum + shippingNum;
  const denominator = 1 - marginNum / 100 - feeNum / 100;
  const priceValid = valid && denominator > 0;
  const recommendedPrice = priceValid ? baseCost / denominator : 0;
  const platformFeeAmount = priceValid ? recommendedPrice * (feeNum / 100) : 0;
  const profitAmount = priceValid ? recommendedPrice - baseCost - platformFeeAmount : 0;
  return (
    <div className="tool-page">
      <h1>Product Pricing Calculator</h1>
      <p className="tool-description">
        Enter your cost per unit, desired profit margin, and any additional shipping cost or
        platform fee percentage to compute the recommended selling price that achieves your target
        margin after fees. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Cost per unit:
          <input type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Desired margin (%):
          <input type="number" min={0} max={99} value={marginPercent} onChange={(e) => setMarginPercent(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Shipping cost:
          <input type="number" min={0} value={shipping} onChange={(e) => setShipping(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Platform fee (%):
          <input type="number" min={0} max={99} value={platformFeePercent} onChange={(e) => setPlatformFeePercent(e.target.value)} style={{ width: '80px' }} />
        </label>
      </div>
      {!priceValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative values, and make sure margin % + platform fee % is less than 100.
        </div>
      )}
      {priceValid && (
        <div className="timestamp-result">
          <div>
            <strong>Recommended selling price:</strong> <code>{recommendedPrice.toFixed(2)}</code>
          </div>
          <div>
            <strong>Platform fee amount:</strong> <code>{platformFeeAmount.toFixed(2)}</code>
          </div>
          <div>
            <strong>Profit per unit:</strong> <code>{profitAmount.toFixed(2)}</code>
          </div>
        </div>
      )}
    </div>
  );
}
