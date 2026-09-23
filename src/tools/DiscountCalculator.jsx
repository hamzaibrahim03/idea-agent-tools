import { useState } from 'react';
export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('100');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [taxPercent, setTaxPercent] = useState('0');
  const price = Number(originalPrice);
  const discount = Number(discountPercent);
  const tax = Number(taxPercent);
  const valid = Number.isFinite(price) && price >= 0 && Number.isFinite(discount) && discount >= 0 && discount <= 100 && Number.isFinite(tax) && tax >= 0;
  const discountAmount = valid ? price * (discount / 100) : 0;
  const priceAfterDiscount = valid ? price - discountAmount : 0;
  const taxAmount = valid ? priceAfterDiscount * (tax / 100) : 0;
  const finalPrice = valid ? priceAfterDiscount + taxAmount : 0;
  const totalSavings = discountAmount;
  return (
    <div className="tool-page">
      <h1>Discount / Sale Price Calculator</h1>
      <p className="tool-description">
        Calculate the sale price after a percentage discount, with an optional tax applied after
        the discount. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Original price:
          <input type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Discount (%):
          <input type="number" min={0} max={100} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Tax after discount (%):
          <input type="number" min={0} value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} style={{ width: '80px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative price, a discount between 0-100%, and a non-negative tax rate.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>You save:</strong> {totalSavings.toFixed(2)}
          </div>
          <div>
            <strong>Price after discount:</strong> {priceAfterDiscount.toFixed(2)}
          </div>
          {tax > 0 && (
            <div>
              <strong>Tax:</strong> {taxAmount.toFixed(2)}
            </div>
          )}
          <div>
            <strong>Final price:</strong> {finalPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
