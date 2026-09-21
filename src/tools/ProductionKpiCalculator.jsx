import { useState } from 'react';
export default function ProductionKpiCalculator() {
  const [useAvailInputs, setUseAvailInputs] = useState(false);
  const [availability, setAvailability] = useState('90');
  const [plannedTime, setPlannedTime] = useState('480');
  const [actualTime, setActualTime] = useState('432');
  const [usePerfInputs, setUsePerfInputs] = useState(false);
  const [performance, setPerformance] = useState('95');
  const [idealCycle, setIdealCycle] = useState('1.0');
  const [totalCount, setTotalCount] = useState('400');
  const [runTime, setRunTime] = useState('420');
  const [quality, setQuality] = useState('98');
  const plannedNum = Number(plannedTime);
  const actualNum = Number(actualTime);
  const availFromTime = plannedNum > 0 ? (actualNum / plannedNum) * 100 : null;
  const effectiveAvailability = useAvailInputs ? availFromTime : Number(availability);
  const idealNum = Number(idealCycle);
  const totalCountNum = Number(totalCount);
  const runTimeNum = Number(runTime);
  const perfFromCycle = runTimeNum > 0 ? ((idealNum * totalCountNum) / runTimeNum) * 100 : null;
  const effectivePerformance = usePerfInputs ? perfFromCycle : Number(performance);
  const qualityNum = Number(quality);
  const valid =
    Number.isFinite(effectiveAvailability) &&
    Number.isFinite(effectivePerformance) &&
    Number.isFinite(qualityNum);
  const oee = valid ? (effectiveAvailability / 100) * (effectivePerformance / 100) * (qualityNum / 100) * 100 : null;
  return (
    <div className="tool-page">
      <h1>Production KPI Calculator (OEE)</h1>
      <p className="tool-description">
        Calculate Overall Equipment Effectiveness (OEE) using the standard formula: OEE = Availability
        x Performance x Quality. Enter the three percentages directly, or optionally compute
        availability from planned vs. actual run time, and performance from ideal vs. actual cycle
        time. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label className="checkbox-label">
          <input type="checkbox" checked={useAvailInputs} onChange={(e) => setUseAvailInputs(e.target.checked)} />
          Compute availability from planned vs. actual time instead of entering it directly
        </label>
        {!useAvailInputs ? (
          <label>
            Availability (%):
            <input type="number" min={0} max={100} step="0.1" value={availability} onChange={(e) => setAvailability(e.target.value)} style={{ width: '90px', marginLeft: 8 }} />
          </label>
        ) : (
          <div className="tool-grid">
            <label>
              Planned run time (minutes):
              <input type="number" min={0} value={plannedTime} onChange={(e) => setPlannedTime(e.target.value)} style={{ width: '100px', marginLeft: 8 }} />
            </label>
            <label>
              Actual run time (minutes):
              <input type="number" min={0} value={actualTime} onChange={(e) => setActualTime(e.target.value)} style={{ width: '100px', marginLeft: 8 }} />
            </label>
          </div>
        )}
      </div>
      <div className="tool-panel">
        <label className="checkbox-label">
          <input type="checkbox" checked={usePerfInputs} onChange={(e) => setUsePerfInputs(e.target.checked)} />
          Compute performance from ideal vs. actual cycle time instead of entering it directly
        </label>
        {!usePerfInputs ? (
          <label>
            Performance (%):
            <input type="number" min={0} max={100} step="0.1" value={performance} onChange={(e) => setPerformance(e.target.value)} style={{ width: '90px', marginLeft: 8 }} />
          </label>
        ) : (
          <div className="tool-grid">
            <label>
              Ideal cycle time (min/unit):
              <input type="number" min={0} step="0.01" value={idealCycle} onChange={(e) => setIdealCycle(e.target.value)} style={{ width: '90px', marginLeft: 8 }} />
            </label>
            <label>
              Total units produced:
              <input type="number" min={0} value={totalCount} onChange={(e) => setTotalCount(e.target.value)} style={{ width: '90px', marginLeft: 8 }} />
            </label>
            <label>
              Actual run time (minutes):
              <input type="number" min={0} value={runTime} onChange={(e) => setRunTime(e.target.value)} style={{ width: '100px', marginLeft: 8 }} />
            </label>
          </div>
        )}
      </div>
      <div className="tool-panel">
        <label htmlFor="pkc-quality">Quality (%) - good units / total units</label>
        <input id="pkc-quality" type="number" min={0} max={100} step="0.1" value={quality} onChange={(e) => setQuality(e.target.value)} style={{ width: '90px' }} />
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter valid values for availability, performance, and quality.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Availability:</strong> {effectiveAvailability.toFixed(1)}%
          </div>
          <div>
            <strong>Performance:</strong> {effectivePerformance.toFixed(1)}%
          </div>
          <div>
            <strong>Quality:</strong> {qualityNum.toFixed(1)}%
          </div>
          <div>
            <strong>OEE:</strong> {oee.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
