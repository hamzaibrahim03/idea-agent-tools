import { createComputeHandler } from '../computeHandler.js';

function computeTotal(base, bonusPct, benefits, raisePct) {
  const baseNum = Number(base) || 0;
  const bonusNum = (Number(bonusPct) || 0) / 100;
  const benefitsNum = Number(benefits) || 0;
  const raiseNum = (Number(raisePct) || 0) / 100;
  const newBase = baseNum * (1 + raiseNum);
  const bonusAmount = newBase * bonusNum;
  return {
    newBase,
    bonusAmount,
    total: newBase + bonusAmount + benefitsNum
  };
}

function compute({ base, bonusPct, benefits, raisePct, offerA, offerB }) {
  const raiseResult = computeTotal(base, bonusPct, benefits, raisePct);
  const currentResult = computeTotal(base, bonusPct, benefits, 0);
  const a = offerA || {};
  const b = offerB || {};
  const totalA = (Number(a.base) || 0) * (1 + (Number(a.bonusPct) || 0) / 100) + (Number(a.benefits) || 0) + (Number(a.equity) || 0);
  const totalB = (Number(b.base) || 0) * (1 + (Number(b.bonusPct) || 0) / 100) + (Number(b.benefits) || 0) + (Number(b.equity) || 0);
  return { raiseResult, currentResult, totalA, totalB };
}

export default createComputeHandler(compute);
