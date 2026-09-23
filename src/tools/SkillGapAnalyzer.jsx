import { useMemo, useState } from 'react';
const ROLE_PRESETS = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'TypeScript', 'Testing'],
  'Data Analyst': ['SQL', 'Excel', 'Python', 'Statistics', 'Data Visualization', 'Tableau', 'A/B Testing'],
  'Product Manager': ['Roadmapping', 'User Research', 'SQL', 'Agile', 'Stakeholder Management', 'Prioritization', 'Analytics'],
  'Digital Marketer': ['SEO', 'Content Strategy', 'Google Analytics', 'Email Marketing', 'Social Media', 'Copywriting', 'A/B Testing']
};
function parseSkills(text) {
  return [...new Set(text.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))];
}
export default function SkillGapAnalyzer() {
  const [currentSkillsText, setCurrentSkillsText] = useState('JavaScript, HTML, CSS, Git');
  const [preset, setPreset] = useState('Frontend Developer');
  const [customTarget, setCustomTarget] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const targetSkillsText = useCustom ? customTarget : ROLE_PRESETS[preset].join(', ');
  const analysis = useMemo(() => {
    const current = parseSkills(currentSkillsText);
    const target = parseSkills(targetSkillsText);
    const currentSet = new Set(current);
    const targetSet = new Set(target);
    const overlap = target.filter((s) => currentSet.has(s));
    const gap = target.filter((s) => !currentSet.has(s));
    const extra = current.filter((s) => !targetSet.has(s));
    return { overlap, gap, extra, targetCount: target.length };
  }, [currentSkillsText, targetSkillsText]);
  return (
    <div className="tool-page">
      <h1>Skill Gap Analyzer</h1>
      <p className="tool-description">
        Enter your current skills and a target role's required skills (or pick a built-in role
        preset). This tool shows the overlap and the gap using simple set comparison - it is not
        real AI analysis, just a straightforward difference between two skill lists. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
          Use custom target skills instead of a preset
        </label>
        {!useCustom && (
          <label>
            Target role:
            <select value={preset} onChange={(e) => setPreset(e.target.value)}>
              {Object.keys(ROLE_PRESETS).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sga-current">Your current skills (comma-separated)</label>
          <textarea id="sga-current" value={currentSkillsText} onChange={(e) => setCurrentSkillsText(e.target.value)} style={{ minHeight: 100 }} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sga-target">Target role skills (comma-separated)</label>
          <textarea
            id="sga-target"
            value={useCustom ? customTarget : targetSkillsText}
            onChange={(e) => setCustomTarget(e.target.value)}
            readOnly={!useCustom}
            style={{ minHeight: 100 }}
          />
        </div>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Skills you already have that match:</strong> {analysis.overlap.length} of {analysis.targetCount}
        </div>
      </div>
      <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Gap: skills to learn ({analysis.gap.length})</h2>
      {analysis.gap.length === 0 ? (
        <p className="tool-placeholder">No gap - your listed skills cover every target skill.</p>
      ) : (
        <ul className="uuid-list">
          {analysis.gap.map((s) => (
            <li key={s}>
              <code>{s}</code>
            </li>
          ))}
        </ul>
      )}
      <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Matching skills ({analysis.overlap.length})</h2>
      {analysis.overlap.length === 0 ? <p className="tool-placeholder">No overlap yet.</p> : <p>{analysis.overlap.join(', ')}</p>}
      <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Extra skills not required for this role ({analysis.extra.length})</h2>
      {analysis.extra.length === 0 ? <p className="tool-placeholder">None.</p> : <p>{analysis.extra.join(', ')}</p>}
    </div>
  );
}
