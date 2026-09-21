import { useState } from 'react';
const SECTIONS = [
  {
    section: 'PPE Requirements',
    items: [
      'Hard hats worn in all active construction zones',
      'High-visibility vests/clothing worn',
      'Steel-toe or safety-rated footwear required',
      'Eye protection for cutting, grinding, and welding tasks',
      'Hearing protection near high-noise equipment',
      'Fall-arrest harnesses for work above defined height threshold',
      'Respiratory protection where dust/fumes are present'
    ]
  },
  {
    section: 'Hazard Categories',
    items: [
      'Fall hazards identified and controlled (guardrails, covers, harnesses)',
      'Electrical hazards identified (lockout/tagout, GFCI protection)',
      'Excavation/trenching hazards controlled (shoring, sloping, barriers)',
      'Heavy equipment and vehicle traffic zones marked',
      'Struck-by hazards from falling objects controlled',
      'Confined space entry procedures in place where applicable',
      'Hazardous materials stored and labeled correctly'
    ]
  },
  {
    section: 'Emergency Procedures',
    items: [
      'Emergency contact numbers posted on site',
      'First aid kit stocked and accessible',
      'Trained first aider/first responder on site',
      'Fire extinguishers present and inspected',
      'Evacuation routes and assembly point identified',
      'Nearest hospital/emergency facility route known',
      'Incident reporting procedure communicated to crew'
    ]
  },
  {
    section: 'Site Safety Management',
    items: [
      'Daily safety briefing / toolbox talk conducted',
      'Site safety signage posted',
      'Visitors and subcontractors inducted on site rules',
      'Regular safety walk-throughs scheduled',
      'Incident log maintained and reviewed'
    ]
  }
];
function itemKey(sectionIdx, itemIdx) {
  return `${sectionIdx}-${itemIdx}`;
}
export default function SafetyPlanChecklist() {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  function toggle(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function resetAll() {
    setChecked({});
  }
  const totalItems = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  function buildSummary() {
    const lines = ['Construction Site Safety Plan Checklist', ''];
    SECTIONS.forEach((s, si) => {
      lines.push(s.section + ':');
      s.items.forEach((item, ii) => {
        const done = checked[itemKey(si, ii)];
        lines.push(`  [${done ? 'x' : ' '}] ${item}`);
      });
      lines.push('');
    });
    lines.push(`Completed: ${checkedCount} / ${totalItems}`);
    return lines.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Construction Site Safety Plan Checklist</h1>
      <p className="tool-description">
        A reference checklist for building a construction site safety plan - PPE requirements, hazard
        categories, emergency procedures, and site safety management - with checkboxes you can tick
        off and a copyable or printable summary. This is a general awareness checklist, not a
        substitute for a site-specific safety plan prepared by a qualified safety officer or required
        by your local regulations (e.g. OSHA or equivalent). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy summary'}
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" onClick={resetAll}>
          Reset all
        </button>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Progress:</strong> {checkedCount} / {totalItems} items checked
        </div>
      </div>
      {SECTIONS.map((s, si) => (
        <div className="tool-panel" key={s.section}>
          <label>{s.section}</label>
          <ul className="uuid-list">
            {s.items.map((item, ii) => {
              const key = itemKey(si, ii);
              return (
                <li key={key}>
                  <label className="checkbox-label" style={{ flex: 1 }}>
                    <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} />
                    {item}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
