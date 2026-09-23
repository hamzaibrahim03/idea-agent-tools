import { useEffect, useState } from 'react';
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
  const [result, setResult] = useState({ valid: false, effectiveAvailability: null, effectivePerformance: null, qualityNum: null, oee: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/production-kpi-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { useAvailInputs, availability, plannedTime, actualTime, usePerfInputs, performance, idealCycle, totalCount, runTime, quality } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [useAvailInputs, availability, plannedTime, actualTime, usePerfInputs, performance, idealCycle, totalCount, runTime, quality]);
  const { valid, effectiveAvailability, effectivePerformance, qualityNum, oee } = result;
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
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter valid values for availability, performance, and quality.
        </div>
      )}
      {!error && valid && (
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
