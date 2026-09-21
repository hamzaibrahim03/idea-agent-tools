import { useMemo, useState } from 'react';
function calculate({ cost, marginPct, platformFeePct, processingFeePct, shipping }) {
  const totalRatePct = marginPct + platformFeePct + processingFeePct;
  if (totalRatePct >= 100) return null;
  const denominator = 1 - totalRatePct / 100;
  const sellingPrice = (cost + shipping) / denominator;
  const platformFeeAmount = sellingPrice * (platformFeePct / 100);
  const processingFeeAmount = sellingPrice * (processingFeePct / 100);
  const marginAmount = sellingPrice * (marginPct / 100);
  const netProfit = sellingPrice - cost - shipping - platformFeeAmount - processingFeeAmount;
  return { sellingPrice, platformFeeAmount, processingFeeAmount, marginAmount, netProfit };
}
export default function EcommerceProductPricingCalculator() {
  const [cost, setCost] = useState('10');
  const [marginPct, setMarginPct] = useState('30');
  const [platformFeePct, setPlatformFeePct] = useState('15');
  const [processingFeePct, setProcessingFeePct] = useState('3');
  const [shipping, setShipping] = useState('2');
  const costNum = parseFloat(cost) || 0;
  const marginNum = parseFloat(marginPct) || 0;
  const platformNum = parseFloat(platformFeePct) || 0;
  const processingNum = parseFloat(processingFeePct) || 0;
  const shippingNum = parseFloat(shipping) || 0;
  const result = useMemo(
    () =>
      calculate({
        cost: costNum,
        marginPct: marginNum,
        platformFeePct: platformNum,
        processingFeePct: processingNum,
        shipping: shippingNum
      }),
    [costNum, marginNum, platformNum, processingNum, shippingNum]
  );
  return (
    <div className="tool-page">
      <h1>E-commerce Pricing Calculator</h1>
      <p className="tool-description">
        Enter your cost of goods, desired margin, marketplace platform fee, payment processing fee,
        and shipping cost to calculate the selling price needed to hit your target margin after all
        fees are deducted. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ep-cost">Cost of goods ($)</label>
          <input id="ep-cost" type="number" min={0} step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ep-shipping">Shipping cost ($)</label>
          <input id="ep-shipping" type="number" min={0} step="0.01" value={shipping} onChange={(e) => setShipping(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ep-margin">Desired margin (%)</label>
          <input id="ep-margin" type="number" min={0} max={99} step="0.1" value={marginPct} onChange={(e) => setMarginPct(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ep-platform">Platform fee (%)</label>
          <input id="ep-platform" type="number" min={0} max={99} step="0.1" value={platformFeePct} onChange={(e) => setPlatformFeePct(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ep-processing">Payment processing fee (%)</label>
          <input id="ep-processing" type="number" min={0} max={99} step="0.1" value={processingFeePct} onChange={(e) => setProcessingFeePct(e.target.value)} />
        </div>
      </div>
      {!result ? (
        <div className="tool-error">Margin + platform fee + processing fee must total less than 100%.</div>
      ) : (
        <div className="timestamp-result">
          <span>
            <strong>Required selling price:</strong> ${result.sellingPrice.toFixed(2)}
          </span>
          <span>
            <strong>Platform fee amount:</strong> ${result.platformFeeAmount.toFixed(2)}
          </span>
          <span>
            <strong>Processing fee amount:</strong> ${result.processingFeeAmount.toFixed(2)}
          </span>
          <span>
            <strong>Margin amount:</strong> ${result.marginAmount.toFixed(2)}
          </span>
          <span>
            <strong>Net profit per unit:</strong> ${result.netProfit.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
