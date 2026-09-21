import { useState } from 'react';
export default function ProductionCostCalculator() {
  const [material, setMaterial] = useState('4.50');
  const [labor, setLabor] = useState('2.25');
  const [overhead, setOverhead] = useState('1.10');
  const [units, setUnits] = useState('1000');
  const materialNum = Number(material);
  const laborNum = Number(labor);
  const overheadNum = Number(overhead);
  const unitsNum = Number(units);
  const valid =
    [materialNum, laborNum, overheadNum].every((n) => Number.isFinite(n) && n >= 0) &&
    Number.isFinite(unitsNum) && unitsNum > 0;
  const costPerUnit = valid ? materialNum + laborNum + overheadNum : null;
  const totalCost = valid ? costPerUnit * unitsNum : null;
  return (
    <div className="tool-page">
      <h1>Production Cost Calculator</h1>
      <p className="tool-description">
        Enter your raw material, labor, and overhead cost per unit along with the number of units to
        produce, and get the total production cost and cost per unit. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pcc-material">Raw material cost per unit</label>
          <input id="pcc-material" type="number" min={0} step="0.01" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-labor">Labor cost per unit</label>
          <input id="pcc-labor" type="number" min={0} step="0.01" value={labor} onChange={(e) => setLabor(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-overhead">Overhead cost per unit</label>
          <input id="pcc-overhead" type="number" min={0} step="0.01" value={overhead} onChange={(e) => setOverhead(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pcc-units">Number of units</label>
          <input id="pcc-units" type="number" min={0} value={units} onChange={(e) => setUnits(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter non-negative costs and a positive number of units.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Cost per unit:</strong> ${costPerUnit.toFixed(2)}
          </div>
          <div>
            <strong>Total production cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
}
