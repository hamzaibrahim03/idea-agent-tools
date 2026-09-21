import { useState } from 'react';
function computeStairs(totalRiseIn, targetRiserIn, treadDepthIn) {
  const rawRisers = totalRiseIn / targetRiserIn;
  const risers = Math.max(1, Math.round(rawRisers));
  const actualRiserHeight = totalRiseIn / risers;
  const treads = Math.max(0, risers - 1);
  const totalRun = treads * treadDepthIn;
  return { risers, actualRiserHeight, treads, totalRun };
}
export default function StairCalculator() {
  const [totalRise, setTotalRise] = useState('108');
  const [targetRiser, setTargetRiser] = useState('7.5');
  const [treadDepth, setTreadDepth] = useState('10');
  const riseNum = Number(totalRise);
  const targetRiserNum = Number(targetRiser);
  const treadNum = Number(treadDepth);
  const valid =
    Number.isFinite(riseNum) && riseNum > 0 &&
    Number.isFinite(targetRiserNum) && targetRiserNum > 0 &&
    Number.isFinite(treadNum) && treadNum >= 0;
  const result = valid ? computeStairs(riseNum, targetRiserNum, treadNum) : null;
  const codeWarning = result && (result.actualRiserHeight < 4 || result.actualRiserHeight > 7.75);
  return (
    <div className="tool-page">
      <h1>Stair Calculator</h1>
      <p className="tool-description">
        Given the total rise (floor-to-floor height) and a target riser height, compute the number
        of risers and steps needed, the actual equal riser height, and - given a chosen tread
        depth - the total horizontal run, using the standard stair-design formula. Runs entirely in
        your browser.
      </p>
      <div className="tool-error">
        <strong>Licensed professional required:</strong> Stair dimensions are governed by local
        building codes (riser height, tread depth, headroom, handrails, and more). This is a
        planning-stage estimate only - have a licensed architect, engineer, or contractor verify
        any design used for actual construction or permits.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sc-rise">Total rise - floor to floor (in)</label>
          <input id="sc-rise" type="number" min={0} value={totalRise} onChange={(e) => setTotalRise(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-target-riser">Target riser height (in, typically 7-7.75)</label>
          <input id="sc-target-riser" type="number" min={0} step="0.125" value={targetRiser} onChange={(e) => setTargetRiser(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-tread">Tread depth (in)</label>
          <input id="sc-tread" type="number" min={0} value={treadDepth} onChange={(e) => setTreadDepth(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive total rise and target riser height, and a
          non-negative tread depth.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>Number of risers (steps):</strong> {result.risers}
          </div>
          <div>
            <strong>Actual riser height:</strong> {result.actualRiserHeight.toFixed(3)} in
          </div>
          <div>
            <strong>Number of treads:</strong> {result.treads}
          </div>
          <div>
            <strong>Total run:</strong> {result.totalRun.toFixed(2)} in ({(result.totalRun / 12).toFixed(2)} ft)
          </div>
          {codeWarning && (
            <div>
              <strong>Note:</strong> Actual riser height falls outside the typical 4-7.75 in
              code range - adjust target riser height or verify local code.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
