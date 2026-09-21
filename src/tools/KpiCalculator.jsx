import { useState } from 'react';
export default function KpiCalculator() {
  const [marketingSpend, setMarketingSpend] = useState('5000');
  const [newCustomers, setNewCustomers] = useState('100');
  const [avgPurchaseValue, setAvgPurchaseValue] = useState('50');
  const [purchaseFrequency, setPurchaseFrequency] = useState('4');
  const [customerLifespan, setCustomerLifespan] = useState('3');
  const [customersLost, setCustomersLost] = useState('10');
  const [totalCustomers, setTotalCustomers] = useState('200');
  const spendNum = Number(marketingSpend);
  const newCustNum = Number(newCustomers);
  const cacValid = Number.isFinite(spendNum) && spendNum >= 0 && Number.isFinite(newCustNum) && newCustNum > 0;
  const cac = cacValid ? spendNum / newCustNum : 0;
  const avgPurchaseNum = Number(avgPurchaseValue);
  const freqNum = Number(purchaseFrequency);
  const lifespanNum = Number(customerLifespan);
  const clvValid =
    Number.isFinite(avgPurchaseNum) && avgPurchaseNum >= 0 &&
    Number.isFinite(freqNum) && freqNum >= 0 &&
    Number.isFinite(lifespanNum) && lifespanNum >= 0;
  const clv = clvValid ? avgPurchaseNum * freqNum * lifespanNum : 0;
  const lostNum = Number(customersLost);
  const totalNum = Number(totalCustomers);
  const churnValid = Number.isFinite(lostNum) && lostNum >= 0 && Number.isFinite(totalNum) && totalNum > 0;
  const churnRate = churnValid ? (lostNum / totalNum) * 100 : 0;
  return (
    <div className="tool-page">
      <h1>KPI Calculator</h1>
      <p className="tool-description">
        Three common business KPI calculators in one place: Customer Acquisition Cost, Customer
        Lifetime Value, and Churn Rate, each using its standard formula. Runs entirely in your
        browser.
      </p>
      <h2 style={{ fontSize: '18px' }}>Customer Acquisition Cost (CAC)</h2>
      <div className="tool-controls">
        <label>
          Marketing spend:
          <input type="number" min={0} value={marketingSpend} onChange={(e) => setMarketingSpend(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          New customers acquired:
          <input type="number" min={0} value={newCustomers} onChange={(e) => setNewCustomers(e.target.value)} style={{ width: '100px' }} />
        </label>
      </div>
      {cacValid ? (
        <div className="timestamp-result" style={{ marginBottom: '20px' }}>
          <strong>CAC:</strong> <code>{cac.toFixed(2)}</code> per customer
        </div>
      ) : (
        <div className="tool-error" style={{ marginBottom: '20px' }}>
          Enter a non-negative spend and a positive number of new customers.
        </div>
      )}
      <h2 style={{ fontSize: '18px' }}>Customer Lifetime Value (CLV)</h2>
      <div className="tool-controls">
        <label>
          Avg. purchase value:
          <input type="number" min={0} value={avgPurchaseValue} onChange={(e) => setAvgPurchaseValue(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Purchase frequency (per year):
          <input type="number" min={0} value={purchaseFrequency} onChange={(e) => setPurchaseFrequency(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Customer lifespan (years):
          <input type="number" min={0} value={customerLifespan} onChange={(e) => setCustomerLifespan(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {clvValid ? (
        <div className="timestamp-result" style={{ marginBottom: '20px' }}>
          <strong>CLV:</strong> <code>{clv.toFixed(2)}</code>
        </div>
      ) : (
        <div className="tool-error" style={{ marginBottom: '20px' }}>
          Enter non-negative values for all three fields.
        </div>
      )}
      <h2 style={{ fontSize: '18px' }}>Churn Rate</h2>
      <div className="tool-controls">
        <label>
          Customers lost (period):
          <input type="number" min={0} value={customersLost} onChange={(e) => setCustomersLost(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Total customers (start of period):
          <input type="number" min={0} value={totalCustomers} onChange={(e) => setTotalCustomers(e.target.value)} style={{ width: '110px' }} />
        </label>
      </div>
      {churnValid ? (
        <div className="timestamp-result">
          <strong>Churn rate:</strong> <code>{churnRate.toFixed(2)}%</code>
        </div>
      ) : (
        <div className="tool-error">Enter a non-negative lost count and a positive total customer count.</div>
      )}
    </div>
  );
}
