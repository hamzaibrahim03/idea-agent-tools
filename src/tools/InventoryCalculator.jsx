import { useState } from 'react';
export default function InventoryCalculator() {
    const [currentStock, setCurrentStock] = useState('5000');
    const [dailyUsage, setDailyUsage] = useState('200');
    const [leadTime, setLeadTime] = useState('7');
    const [safetyStock, setSafetyStock] = useState('400');
    const stockNum = Number(currentStock);
    const usageNum = Number(dailyUsage);
    const leadTimeNum = Number(leadTime);
    const safetyNum = Number(safetyStock);
    const valid =
        Number.isFinite(stockNum) && stockNum >= 0 &&
        Number.isFinite(usageNum) && usageNum > 0 &&
        Number.isFinite(leadTimeNum) && leadTimeNum >= 0 &&
        Number.isFinite(safetyNum) && safetyNum >= 0;
    const daysRemaining = valid ? stockNum / usageNum : null;
    const reorderPoint = valid ? usageNum * leadTimeNum + safetyNum : null;
    const belowReorderPoint = valid && stockNum <= reorderPoint;
    return (
        <div className="tool-page">
            <h1>Manufacturing Inventory Calculator</h1>
            <p className="tool-description">
                Enter your current raw material stock, daily usage rate, and lead time to restock, and get
                days of stock remaining and the reorder point at which you should place a new order. Runs
                entirely in your browser.
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
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a non-negative current stock, a positive daily usage rate, and non-negative lead time and safety stock.
                </div>
            )}
            {valid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Days of stock remaining:</strong> {daysRemaining.toFixed(1)} days
                    </div>
                    <div>
                        <strong>Reorder point:</strong> {reorderPoint.toLocaleString(undefined, { maximumFractionDigits: 1 })} units
                    </div>
                    {belowReorderPoint && (
                        <div style={{ color: '#dc2626', fontWeight: 600 }}>
                            Current stock is at or below the reorder point - reorder now.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
