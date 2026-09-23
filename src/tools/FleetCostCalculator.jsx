import { useState } from 'react';
export default function FleetCostCalculator() {
  const [vehicleCount, setVehicleCount] = useState('12');
  const [fuelCost, setFuelCost] = useState('450');
  const [maintenanceCost, setMaintenanceCost] = useState('150');
  const [insuranceCost, setInsuranceCost] = useState('200');
  const vehicleCountNum = Number(vehicleCount);
  const fuelNum = Number(fuelCost);
  const maintenanceNum = Number(maintenanceCost);
  const insuranceNum = Number(insuranceCost);
  const valid =
    Number.isFinite(vehicleCountNum) && vehicleCountNum > 0 &&
    [fuelNum, maintenanceNum, insuranceNum].every((n) => Number.isFinite(n) && n >= 0);
  const costPerVehicleMonthly = valid ? fuelNum + maintenanceNum + insuranceNum : null;
  const totalMonthly = valid ? costPerVehicleMonthly * vehicleCountNum : null;
  const totalAnnual = valid ? totalMonthly * 12 : null;
  return (
    <div className="tool-page">
      <h1>Fleet Cost Calculator</h1>
      <p className="tool-description">
        Enter the number of vehicles in your fleet and the average monthly cost per vehicle (fuel,
        maintenance, and insurance), and get total monthly and annual fleet operating cost. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="fcc-count">Number of vehicles</label>
          <input id="fcc-count" type="number" min={0} value={vehicleCount} onChange={(e) => setVehicleCount(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fcc-fuel">Avg. monthly fuel cost per vehicle</label>
          <input id="fcc-fuel" type="number" min={0} step="0.01" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fcc-maint">Avg. monthly maintenance cost per vehicle</label>
          <input id="fcc-maint" type="number" min={0} step="0.01" value={maintenanceCost} onChange={(e) => setMaintenanceCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fcc-insurance">Avg. monthly insurance cost per vehicle</label>
          <input id="fcc-insurance" type="number" min={0} step="0.01" value={insuranceCost} onChange={(e) => setInsuranceCost(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive number of vehicles and non-negative cost values.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Cost per vehicle (monthly):</strong> ${costPerVehicleMonthly.toFixed(2)}
          </div>
          <div>
            <strong>Total fleet cost (monthly):</strong> ${totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <strong>Total fleet cost (annual):</strong> ${totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
}
