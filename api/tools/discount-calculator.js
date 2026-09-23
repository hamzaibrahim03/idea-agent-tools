import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ originalPrice, discountPercent, taxPercent }) {
  const price = Number(originalPrice);
  const discount = Number(discountPercent);
  const tax = Number(taxPercent);
  const valid = Number.isFinite(price) && price >= 0 && Number.isFinite(discount) && discount >= 0 && discount <= 100 && Number.isFinite(tax) && tax >= 0;
  const discountAmount = valid ? price * (discount / 100) : 0;
  const priceAfterDiscount = valid ? price - discountAmount : 0;
  const taxAmount = valid ? priceAfterDiscount * (tax / 100) : 0;
  const finalPrice = valid ? priceAfterDiscount + taxAmount : 0;
  const totalSavings = discountAmount;
  return { valid, discountAmount, priceAfterDiscount, taxAmount, finalPrice, totalSavings, tax };
}

export default createComputeHandler(compute);
