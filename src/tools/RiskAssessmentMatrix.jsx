import { useEffect, useState } from 'react';
const DEFAULT_RISKS = [
  { description: 'Fall from height during roofing work', likelihood: '3', severity: '5' },
  { description: 'Trench collapse during excavation', likelihood: '2', severity: '5' },
  { description: 'Minor hand tool injury', likelihood: '4', severity: '2' }
];
export default function RiskAssessmentMatrix() {
  const [risks, setRisks] = useState(DEFAULT_RISKS);
  const [scored, setScored] = useState([]);
  const [error, setError] = useState('');
  function updateRisk(index, field, value) {
    setRisks((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }
  function addRisk() {
    setRisks((prev) => [...prev, { description: '', likelihood: '3', severity: '3' }]);
  }
  function removeRisk(index) {
    setRisks((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/construction-risk-assessment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { risks } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setScored(data.scored);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [risks]);
  return (
    <div className="tool-page">
      <h1>Construction Risk Assessment Matrix</h1>
      <p className="tool-description">
        Build a simple 5x5 risk assessment matrix for a construction project - add risk items, rate
        likelihood and severity from 1-5, and the tool computes a risk score (likelihood x severity)
        for each, color-coded and sorted by risk level using standard matrix thresholds (Low, Medium,
        High, Critical). This is a general planning aid, not a substitute for a formal safety risk
        assessment conducted by a qualified professional. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button type="button" onClick={addRisk}>
          Add risk
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Risk description</th>
              <th>Likelihood (1-5)</th>
              <th>Severity (1-5)</th>
              <th>Score</th>
              <th>Level</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r) => (
              <tr key={r.originalIndex}>
                <td>
                  <input
                    type="text"
                    value={r.description}
                    onChange={(e) => updateRisk(r.originalIndex, 'description', e.target.value)}
                    placeholder="e.g. Fall from scaffolding"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.likelihood}
                    onChange={(e) => updateRisk(r.originalIndex, 'likelihood', e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.severity}
                    onChange={(e) => updateRisk(r.originalIndex, 'severity', e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>
                  <code>{r.validRow ? r.score : '—'}</code>
                </td>
                <td>
                  {r.level && (
                    <span
                      style={{
                        color: r.level.color,
                        background: r.level.bg,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontWeight: 600,
                        fontSize: '13px'
                      }}
                    >
                      {r.level.label}
                    </span>
                  )}
                  {!r.validRow && '—'}
                </td>
                <td>
                  <button
                    type="button"
                    className="uuid-copy-btn"
                    onClick={() => removeRisk(r.originalIndex)}
                    disabled={risks.length <= 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {scored.some((r) => !r.validRow) && (
        <div className="tool-error">
          <strong>Error:</strong> Likelihood and severity must each be between 1 and 5.
        </div>
      )}
      <p className="tool-placeholder">
        Thresholds: score 1-3 Low, 4-7 Medium, 8-14 High, 15-25 Critical.
      </p>
    </div>
  );
}
