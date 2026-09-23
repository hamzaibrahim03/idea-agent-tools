import { createComputeHandler } from '../computeHandler.js';

function computeCoverage(bill, deductibleRemaining, coinsurancePercent, oopMax, oopSpentSoFar) {
  let remainingBill = bill;
  let patientPays = 0;
  const deductiblePortion = Math.min(remainingBill, Math.max(0, deductibleRemaining));
  patientPays += deductiblePortion;
  remainingBill -= deductiblePortion;
  const coinsuranceOnRemainder = remainingBill * (coinsurancePercent / 100);
  let patientTotalIfUncapped = patientPays + coinsuranceOnRemainder;
  const spentBeforeThisBill = oopSpentSoFar;
  const roomLeftInOopMax = Math.max(0, oopMax - spentBeforeThisBill);
  let finalPatientPays;
  if (patientTotalIfUncapped <= roomLeftInOopMax) {
    finalPatientPays = patientTotalIfUncapped;
  } else {
    finalPatientPays = roomLeftInOopMax;
  }
  const insurancePays = bill - finalPatientPays;
  return { patientPays: finalPatientPays, insurancePays };
}

function compute({ bill, deductibleRemaining, coinsurance, oopMax, oopSpent }) {
  const billNum = Number(bill);
  const deductibleNum = Number(deductibleRemaining);
  const coinsuranceNum = Number(coinsurance);
  const oopMaxNum = Number(oopMax);
  const oopSpentNum = Number(oopSpent);
  const valid =
    Number.isFinite(billNum) && billNum >= 0 &&
    Number.isFinite(deductibleNum) && deductibleNum >= 0 &&
    Number.isFinite(coinsuranceNum) && coinsuranceNum >= 0 && coinsuranceNum <= 100 &&
    Number.isFinite(oopMaxNum) && oopMaxNum >= 0 &&
    Number.isFinite(oopSpentNum) && oopSpentNum >= 0;
  if (!valid) {
    throw new Error('Enter valid non-negative amounts, and a coinsurance percentage between 0 and 100.');
  }
  const result = computeCoverage(billNum, deductibleNum, coinsuranceNum, oopMaxNum, oopSpentNum);
  return { valid, result };
}

export default createComputeHandler(compute);
