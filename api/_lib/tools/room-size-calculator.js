import { createComputeHandler } from '../computeHandler.js';

function compute({ mode, targetArea, aspectRatio, fixedDimension }) {
  const areaNum = Number(targetArea);
  const areaValid = Number.isFinite(areaNum) && areaNum > 0;
  let result = null;
  let errorMsg = '';
  if (mode === 'ratio') {
    const ratioNum = Number(aspectRatio);
    if (!areaValid) {
      errorMsg = 'Enter a positive target area.';
    } else if (!Number.isFinite(ratioNum) || ratioNum <= 0) {
      errorMsg = 'Enter a positive aspect ratio (length ÷ width).';
    } else {
      const width = Math.sqrt(areaNum / ratioNum);
      const length = width * ratioNum;
      result = { width, length };
    }
  } else {
    const fixedNum = Number(fixedDimension);
    if (!areaValid) {
      errorMsg = 'Enter a positive target area.';
    } else if (!Number.isFinite(fixedNum) || fixedNum <= 0) {
      errorMsg = 'Enter a positive fixed dimension.';
    } else {
      const other = areaNum / fixedNum;
      result = { fixed: fixedNum, other };
    }
  }
  return { result, validationError: errorMsg, areaNum };
}

export default createComputeHandler(compute);
