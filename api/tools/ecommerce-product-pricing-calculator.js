import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ cost, marginPct, platformFeePct, processingFeePct, shipping }) {
  const costNum = parseFloat(cost) || 0;
  const marginNum = parseFloat(marginPct) || 0;
  const platformNum = parseFloat(platformFeePct) || 0;
  const processingNum = parseFloat(processingFeePct) || 0;
  const shippingNum = parseFloat(shipping) || 0;
  const result = calculate({
    cost: costNum,
    marginPct: marginNum,
    platformFeePct: platformNum,
    processingFeePct: processingNum,
    shipping: shippingNum
  });
  return { result };
}

export default createComputeHandler(compute);
