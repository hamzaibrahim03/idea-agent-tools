import { useEffect, useState } from 'react';
export default function DiscountCalculator() {
    const [originalPrice, setOriginalPrice] = useState('100');
    const [discountPercent, setDiscountPercent] = useState('20');
    const [taxPercent, setTaxPercent] = useState('0');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/discount-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { originalPrice, discountPercent, taxPercent } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [originalPrice, discountPercent, taxPercent]);
    const { valid, totalSavings, priceAfterDiscount, taxAmount, finalPrice, tax } = result || {};
    return (
        <div className="tool-page">
            <h1>Discount / Sale Price Calculator</h1>
            <p className="tool-description">
                Calculate the sale price after a percentage discount, with an optional tax applied after
                the discount.
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
            {error && <div className="agent-error">{error}</div>}
            {result && !valid && (
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
