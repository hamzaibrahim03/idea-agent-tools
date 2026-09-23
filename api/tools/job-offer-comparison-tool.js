import { createComputeHandler } from '../_lib/computeHandler.js';

function computeValue(offer) {
  const base = Number(offer.base) || 0;
  const bonus = Number(offer.bonus) || 0;
  const benefits = Number(offer.benefits) || 0;
  const commuteCost = Number(offer.commuteCost) || 0;
  const commuteMinutes = Number(offer.commuteMinutes) || 0;
  const remoteScore = Number(offer.remoteScore) || 0;
  const annualCommuteCost = commuteCost * 240;
  const annualCommuteTimeCost = (commuteMinutes * 2 * 240 / 60) * 25;
  const remoteBonusValue = remoteScore * 500;
  const totalValue = base + bonus + benefits + remoteBonusValue - annualCommuteCost - annualCommuteTimeCost;
  return { totalValue, annualCommuteCost, annualCommuteTimeCost, remoteBonusValue };
}

function compute({ offerA, offerB }) {
  return { resultA: computeValue(offerA || {}), resultB: computeValue(offerB || {}) };
}

export default createComputeHandler(compute);
