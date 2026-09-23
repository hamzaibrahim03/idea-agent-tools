import { useEffect, useState } from 'react';
const DEFAULT_LINE_ITEMS = [
    { id: 1, label: 'COGS', value: '' },
    { id: 2, label: 'Shipping', value: '' },
    { id: 3, label: 'Platform / payment fees', value: '' },
    { id: 4, label: 'Ad spend', value: '' },
    { id: 5, label: 'Returns / refunds', value: '' }
];
export default function EcommerceProfitCalculator() {
    const [revenue, setRevenue] = useState('5000');
    const [lineItems, setLineItems] = useState(DEFAULT_LINE_ITEMS);
    const [result, setResult] = useState({ totalCosts: 0, netProfit: 0, marginPct: 0 });
    const [fetchError, setFetchError] = useState('');
    function updateItem(id, value) {
        setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/ecommerce-profit-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { revenue, lineItems } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [revenue, lineItems]);
    return (
        <div className="tool-page">
            <h1>E-commerce Profit Calculator</h1>
            <p className="tool-description">
                Enter your revenue and cost line items (COGS, shipping, fees, ad spend, returns/refunds) to
                calculate net profit and profit margin. Runs entirely in your browser.
            </p>
            <div className="tool-panel">
                <label htmlFor="ecp-revenue">Revenue ($)</label>
                <input id="ecp-revenue" type="number" min={0} step="0.01" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
            </div>
            <div className="tool-grid">
                {lineItems.map((item) => (
                    <div className="tool-panel" key={item.id}>
                        <label htmlFor={`ecp-item-${item.id}`}>{item.label} ($)</label>
                        <input id={`ecp-item-${item.id}`} type="number" min={0} step="0.01" value={item.value} onChange={(e) => updateItem(item.id, e.target.value)} />
                    </div>
                ))}
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="timestamp-result">
                <span>
                    <strong>Total costs:</strong> ${result.totalCosts.toFixed(2)}
                </span>
                <span>
                    <strong>Net profit:</strong> ${result.netProfit.toFixed(2)}
                </span>
                <span>
                    <strong>Profit margin:</strong> {result.marginPct.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}
