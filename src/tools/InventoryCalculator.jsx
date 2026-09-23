import { useEffect, useState } from 'react';
export default function InventoryCalculator() {
    const [currentStock, setCurrentStock] = useState('5000');
    const [dailyUsage, setDailyUsage] = useState('200');
    const [leadTime, setLeadTime] = useState('7');
    const [safetyStock, setSafetyStock] = useState('400');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/manufacturing-inventory-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { currentStock, dailyUsage, leadTime, safetyStock } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) { setError(d.error); setData(null); }
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [currentStock, dailyUsage, leadTime, safetyStock]);
    return (
        <div className="tool-page">
            <h1>Manufacturing Inventory Calculator</h1>
            <p className="tool-description">
                Enter your current raw material stock, daily usage rate, and lead time to restock, and get
                days of stock remaining and the reorder point at which you should place a new order.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ic-stock">Current stock (units)</label>
                    <input id="ic-stock" type="number" min={0} value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-usage">Daily usage rate (units/day)</label>
                    <input id="ic-usage" type="number" min={0} value={dailyUsage} onChange={(e) => setDailyUsage(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-leadtime">Lead time to restock (days)</label>
                    <input id="ic-leadtime" type="number" min={0} value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-safety">Safety stock (units, optional)</label>
                    <input id="ic-safety" type="number" min={0} value={safetyStock} onChange={(e) => setSafetyStock(e.target.value)} />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {data && (
                <div className="timestamp-result">
                    <div>
                        <strong>Days of stock remaining:</strong> {data.daysRemaining.toFixed(1)} days
                    </div>
                    <div>
                        <strong>Reorder point:</strong> {data.reorderPoint.toLocaleString(undefined, { maximumFractionDigits: 1 })} units
                    </div>
                    {data.belowReorderPoint && (
                        <div style={{ color: '#dc2626', fontWeight: 600 }}>
                            Current stock is at or below the reorder point - reorder now.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
