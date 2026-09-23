import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ bill, tipPercent, people }) {
  const billNum = Number(bill) || 0;
  const tipAmount = (billNum * Number(tipPercent)) / 100;
  const total = billNum + tipAmount;
  const peopleNum = Math.max(1, Number(people) || 1);
  return {
    tipAmount,
    total,
    perPerson: total / peopleNum,
    tipPerPerson: tipAmount / peopleNum
  };
}

export default createComputeHandler(compute);
