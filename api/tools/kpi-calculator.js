import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ marketingSpend, newCustomers, avgPurchaseValue, purchaseFrequency, customerLifespan, customersLost, totalCustomers }) {
  const spendNum = Number(marketingSpend);
  const newCustNum = Number(newCustomers);
  const cacValid = Number.isFinite(spendNum) && spendNum >= 0 && Number.isFinite(newCustNum) && newCustNum > 0;
  const cac = cacValid ? spendNum / newCustNum : 0;

  const avgPurchaseNum = Number(avgPurchaseValue);
  const freqNum = Number(purchaseFrequency);
  const lifespanNum = Number(customerLifespan);
  const clvValid =
    Number.isFinite(avgPurchaseNum) && avgPurchaseNum >= 0 &&
    Number.isFinite(freqNum) && freqNum >= 0 &&
    Number.isFinite(lifespanNum) && lifespanNum >= 0;
  const clv = clvValid ? avgPurchaseNum * freqNum * lifespanNum : 0;

  const lostNum = Number(customersLost);
  const totalNum = Number(totalCustomers);
  const churnValid = Number.isFinite(lostNum) && lostNum >= 0 && Number.isFinite(totalNum) && totalNum > 0;
  const churnRate = churnValid ? (lostNum / totalNum) * 100 : 0;

  return { cacValid, cac, clvValid, clv, churnValid, churnRate };
}

export default createComputeHandler(compute);
