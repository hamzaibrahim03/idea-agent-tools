import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ percent, ofValue, partValue, wholeValue, fromValue, toValue }) {
  const percentOfResult =
    percent !== '' && ofValue !== '' ? (Number(percent) / 100) * Number(ofValue) : null;
  const whatPercentResult =
    partValue !== '' && wholeValue !== '' && Number(wholeValue) !== 0
      ? (Number(partValue) / Number(wholeValue)) * 100
      : null;
  const changeResult =
    fromValue !== '' && toValue !== '' && Number(fromValue) !== 0
      ? ((Number(toValue) - Number(fromValue)) / Number(fromValue)) * 100
      : null;
  return { percentOfResult, whatPercentResult, changeResult };
}

export default createComputeHandler(compute);
