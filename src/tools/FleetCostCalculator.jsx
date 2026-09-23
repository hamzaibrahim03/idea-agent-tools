import { useEffect, useState } from 'react';
export default function FleetCostCalculator() {
    const [vehicleCount, setVehicleCount] = useState('12');
    const [fuelCost, setFuelCost] = useState('450');
    const [maintenanceCost, setMaintenanceCost] = useState('150');
    const [insuranceCost, setInsuranceCost] = useState('200');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/fleet-cost-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { vehicleCount, fuelCost, maintenanceCost, insuranceCost } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) { setError(data.error); setResult(null); }
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [vehicleCount, fuelCost, maintenanceCost, insuranceCost]);
    return (
        <div className="tool-page">
            <h1>Fleet Cost Calculator</h1>
            <p className="tool-description">
                Enter the number of vehicles in your fleet and the average monthly cost per vehicle (fuel,
                maintenance, and insurance), and get total monthly and annual fleet operating cost.
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
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Cost per vehicle (monthly):</strong> ${result.costPerVehicleMonthly.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total fleet cost (monthly):</strong> ${result.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div>
                        <strong>Total fleet cost (annual):</strong> ${result.totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                </div>
            )}
        </div>
    );
}
