import { useMemo, useState } from 'react';
function calculate({ avgDailySales, leadTimeDays, safetyStockDays }) {
  const leadTimeDemand = avgDailySales * leadTimeDays;
  const safetyStock = avgDailySales * safetyStockDays;
  const reorderPoint = leadTimeDemand + safetyStock;
  return { leadTimeDemand, safetyStock, reorderPoint };
}
export default function InventoryReorderCalculator() {
  const [avgDailySales, setAvgDailySales] = useState('10');
  const [leadTimeDays, setLeadTimeDays] = useState('7');
  const [safetyStockDays, setSafetyStockDays] = useState('3');
  const avgNum = parseFloat(avgDailySales) || 0;
  const leadNum = parseFloat(leadTimeDays) || 0;
  const safetyNum = parseFloat(safetyStockDays) || 0;
  const result = useMemo(
    () => calculate({ avgDailySales: avgNum, leadTimeDays: leadNum, safetyStockDays: safetyNum }),
    [avgNum, leadNum, safetyNum]
  );
  return (
    <div className="tool-page">
      <h1>Inventory Reorder Point Calculator</h1>
      <p className="tool-description">
        Enter your average daily sales, restock lead time, and a safety stock buffer (in days) to
        calculate the reorder point - the inventory level at which you should place a new order,
        using the standard formula: (avg daily sales x lead time) + safety stock. Runs entirely in
        your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ir-sales">Average daily sales (units)</label>
          <input id="ir-sales" type="number" min={0} step="0.1" value={avgDailySales} onChange={(e) => setAvgDailySales(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ir-lead">Lead time (days to restock)</label>
          <input id="ir-lead" type="number" min={0} step="1" value={leadTimeDays} onChange={(e) => setLeadTimeDays(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ir-safety">Safety stock buffer (days)</label>
          <input id="ir-safety" type="number" min={0} step="1" value={safetyStockDays} onChange={(e) => setSafetyStockDays(e.target.value)} />
        </div>
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Lead time demand:</strong> {result.leadTimeDemand.toFixed(1)} units
        </span>
        <span>
          <strong>Safety stock:</strong> {result.safetyStock.toFixed(1)} units
        </span>
        <span>
          <strong>Reorder point:</strong> {result.reorderPoint.toFixed(1)} units
        </span>
      </div>
    </div>
  );
}
