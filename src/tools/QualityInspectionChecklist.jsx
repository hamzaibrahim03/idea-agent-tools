import { useState } from 'react';
const DEFAULT_CRITERIA = [
  { name: 'Dimensions within tolerance', result: null },
  { name: 'Surface finish acceptable', result: null },
  { name: 'No visible defects', result: null }
];
export default function QualityInspectionChecklist() {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  function updateName(index, value) {
    setCriteria((prev) => prev.map((c, i) => (i === index ? { ...c, name: value } : c)));
  }
  function setResult(index, result) {
    setCriteria((prev) => prev.map((c, i) => (i === index ? { ...c, result } : c)));
  }
  function addCriterion() {
    setCriteria((prev) => [...prev, { name: '', result: null }]);
  }
  function removeCriterion(index) {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  }
  const evaluated = criteria.filter((c) => c.result !== null);
  const passCount = criteria.filter((c) => c.result === true).length;
  const failCount = criteria.filter((c) => c.result === false).length;
  const passRate = evaluated.length > 0 ? (passCount / evaluated.length) * 100 : null;
  return (
    <div className="tool-page">
      <h1>Quality Inspection Checklist</h1>
      <p className="tool-description">
        Define your own inspection criteria, mark each as pass or fail, and get an overall pass rate.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addCriterion}>
          Add criterion
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder="e.g. Dimensions within tolerance"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <div className="tool-controls" style={{ margin: 0 }}>
                    <button type="button" onClick={() => setResult(i, true)} disabled={c.result === true}>
                      Pass
                    </button>
                    <button type="button" onClick={() => setResult(i, false)} disabled={c.result === false}>
                      Fail
                    </button>
                    {c.result !== null && (
                      <button type="button" onClick={() => setResult(i, null)}>
                        Clear
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeCriterion(i)} disabled={criteria.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Passed:</strong> {passCount}
        </div>
        <div>
          <strong>Failed:</strong> {failCount}
        </div>
        <div>
          <strong>Evaluated:</strong> {evaluated.length} / {criteria.length}
        </div>
        <div>
          <strong>Pass rate:</strong> {passRate !== null ? `${passRate.toFixed(1)}%` : 'N/A'}
        </div>
      </div>
    </div>
  );
}
