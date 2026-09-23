import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ favorable, total, probA, probB }) {
  const favorableNum = Number(favorable);
  const totalNum = Number(total);
  const singleValid =
    Number.isFinite(favorableNum) && favorableNum >= 0 &&
    Number.isFinite(totalNum) && totalNum > 0 && favorableNum <= totalNum;
  const singleProb = singleValid ? favorableNum / totalNum : null;
  const probANum = Number(probA);
  const probBNum = Number(probB);
  const combinedValid =
    Number.isFinite(probANum) && probANum >= 0 && probANum <= 1 &&
    Number.isFinite(probBNum) && probBNum >= 0 && probBNum <= 1;
  const both = combinedValid ? probANum * probBNum : null;
  const either = combinedValid ? probANum + probBNum - both : null;
  return { singleValid, singleProb, combinedValid, both, either };
}

export default createComputeHandler(compute);
