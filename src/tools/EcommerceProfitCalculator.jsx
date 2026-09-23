import { useMemo, useState } from 'react';
const DEFAULT_LINE_ITEMS = [
  { id: 1, label: 'COGS', value: '' },
  { id: 2, label: 'Shipping', value: '' },
  { id: 3, label: 'Platform / payment fees', value: '' },
  { id: 4, label: 'Ad spend', value: '' },
  { id: 5, label: 'Returns / refunds', value: '' }
];
function calculate(revenue, lineItems) {
  const totalCosts = lineItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const netProfit = revenue - totalCosts;
  const marginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  return { totalCosts, netProfit, marginPct };
}
export default function EcommerceProfitCalculator() {
  const [revenue, setRevenue] = useState('5000');
  const [lineItems, setLineItems] = useState(DEFAULT_LINE_ITEMS);
  const revenueNum = parseFloat(revenue) || 0;
  function updateItem(id, value) {
    setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
  }
  const result = useMemo(() => calculate(revenueNum, lineItems), [revenueNum, lineItems]);
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
            <input
              id={`ecp-item-${item.id}`}
              type="number"
              min={0}
              step="0.01"
              value={item.value}
              onChange={(e) => updateItem(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>
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
