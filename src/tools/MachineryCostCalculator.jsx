import { useState } from 'react';
export default function MachineryCostCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('120000');
  const [salvageValue, setSalvageValue] = useState('20000');
  const [usefulLifeYears, setUsefulLifeYears] = useState('10');
  const [annualMaintenance, setAnnualMaintenance] = useState('3500');
  const [annualHours, setAnnualHours] = useState('400');
  const priceNum = Number(purchasePrice);
  const salvageNum = Number(salvageValue);
  const lifeNum = Number(usefulLifeYears);
  const maintenanceNum = Number(annualMaintenance);
  const hoursNum = Number(annualHours);
  const valid =
    Number.isFinite(priceNum) && priceNum > 0 &&
    Number.isFinite(salvageNum) && salvageNum >= 0 && salvageNum <= priceNum &&
    Number.isFinite(lifeNum) && lifeNum > 0 &&
    Number.isFinite(maintenanceNum) && maintenanceNum >= 0 &&
    Number.isFinite(hoursNum) && hoursNum > 0;
  const annualDepreciation = valid ? (priceNum - salvageNum) / lifeNum : null;
  const totalAnnualCost = valid ? annualDepreciation + maintenanceNum : null;
  const costPerHour = valid ? totalAnnualCost / hoursNum : null;
  return (
    <div className="tool-page">
      <h1>Machinery Cost Calculator</h1>
      <p className="tool-description">
        Enter a machine's purchase price, expected useful life, salvage value, and annual maintenance
        cost to compute straight-line depreciation per year and cost per hour of use based on
        estimated annual usage hours. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="mcc-price">Purchase price</label>
          <input id="mcc-price" type="number" min={0} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-salvage">Salvage value (end of life)</label>
          <input id="mcc-salvage" type="number" min={0} value={salvageValue} onChange={(e) => setSalvageValue(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-life">Useful life (years)</label>
          <input id="mcc-life" type="number" min={0} value={usefulLifeYears} onChange={(e) => setUsefulLifeYears(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-maint">Annual maintenance cost</label>
          <input id="mcc-maint" type="number" min={0} value={annualMaintenance} onChange={(e) => setAnnualMaintenance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mcc-hours">Estimated annual hours of use</label>
          <input id="mcc-hours" type="number" min={0} value={annualHours} onChange={(e) => setAnnualHours(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive purchase price, a salvage value between 0 and the purchase price, a positive useful life, non-negative maintenance cost, and positive annual hours.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Annual depreciation (straight-line):</strong> ${annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Total annual cost (depreciation + maintenance):</strong> ${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Cost per hour of use:</strong> ${costPerHour.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
