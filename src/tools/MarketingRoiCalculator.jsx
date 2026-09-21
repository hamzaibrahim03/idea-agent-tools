import { useMemo, useState } from 'react';
function calculate({ spend, revenue, customers }) {
  if (spend <= 0) return null;
  const roiPercent = ((revenue - spend) / spend) * 100;
  const roas = revenue / spend;
  const cpa = customers > 0 ? spend / customers : null;
  return { roiPercent, roas, cpa };
}
export default function MarketingRoiCalculator() {
  const [spend, setSpend] = useState('1000');
  const [revenue, setRevenue] = useState('3000');
  const [customers, setCustomers] = useState('20');
  const spendNum = parseFloat(spend) || 0;
  const revenueNum = parseFloat(revenue) || 0;
  const customersNum = parseFloat(customers) || 0;
  const result = useMemo(
    () => calculate({ spend: spendNum, revenue: revenueNum, customers: customersNum }),
    [spendNum, revenueNum, customersNum]
  );
  return (
    <div className="tool-page">
      <h1>Marketing ROI Calculator</h1>
      <p className="tool-description">
        Enter your marketing spend, the revenue it generated, and (optionally) the number of
        customers acquired to calculate ROI %, ROAS (return on ad spend), and cost per acquisition
        using standard marketing formulas. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="roi-spend">Marketing spend ($)</label>
          <input id="roi-spend" type="number" min={0} step="0.01" value={spend} onChange={(e) => setSpend(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-revenue">Revenue generated ($)</label>
          <input id="roi-revenue" type="number" min={0} step="0.01" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roi-customers">Customers acquired (optional)</label>
          <input id="roi-customers" type="number" min={0} step="1" value={customers} onChange={(e) => setCustomers(e.target.value)} />
        </div>
      </div>
      {spendNum <= 0 ? (
        <div className="tool-error">Enter a marketing spend greater than 0.</div>
      ) : (
        <div className="timestamp-result">
          <span>
            <strong>ROI:</strong> {result.roiPercent.toFixed(1)}%
          </span>
          <span>
            <strong>ROAS:</strong> {result.roas.toFixed(2)}x (every $1 spent returned ${result.roas.toFixed(2)})
          </span>
          <span>
            <strong>Cost per acquisition:</strong>{' '}
            {result.cpa !== null ? `$${result.cpa.toFixed(2)}` : 'Enter customers acquired to calculate'}
          </span>
        </div>
      )}
    </div>
  );
}
