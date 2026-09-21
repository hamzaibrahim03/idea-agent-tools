import { useState } from 'react';
const WORKPLACE_CHECKLISTS = {
  factory: {
    label: 'Factory Floor',
    items: [
      'Machine guards in place on all equipment',
      'Emergency stops tested and accessible',
      'PPE worn per task (glasses, gloves, hearing protection)',
      'Walkways and exits clear of obstructions',
      'Spill response materials available near hazardous areas',
      'Lockout/tagout procedures posted and followed'
    ]
  },
  warehouse: {
    label: 'Warehouse',
    items: [
      'Racking inspected for damage and overloading',
      'Forklift operators certified and pre-shift checks logged',
      'Pedestrian and forklift traffic lanes clearly marked',
      'Loading dock edges guarded, dock plates secured',
      'Fire extinguishers accessible and inspected',
      'Emergency exits unobstructed and clearly marked'
    ]
  },
  office: {
    label: 'Office',
    items: [
      'Walkways and stairwells free of trip hazards',
      'Fire extinguishers and smoke detectors inspected',
      'Emergency exits clearly marked and unlocked during hours',
      'Electrical cords not run across walkways',
      'Ergonomic setup reviewed for workstations',
      'First aid kit stocked and accessible'
    ]
  }
};
export default function SafetyChecklistGenerator() {
  const [workplace, setWorkplace] = useState('factory');
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const current = WORKPLACE_CHECKLISTS[workplace];
  function toggle(index) {
    setChecked((prev) => ({ ...prev, [`${workplace}-${index}`]: !prev[`${workplace}-${index}`] }));
  }
  const checkedCount = current.items.filter((_, i) => checked[`${workplace}-${i}`]).length;
  function buildSummary() {
    const lines = [`${current.label} Safety Checklist`, ''];
    current.items.forEach((item, i) => {
      lines.push(`[${checked[`${workplace}-${i}`] ? 'x' : ' '}] ${item}`);
    });
    lines.push('', `Completed: ${checkedCount} / ${current.items.length}`);
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
      <h1>Workplace Safety Checklist</h1>
      <p className="tool-description">
        Pick a workplace type and get a curated reference safety checklist you can check off, copy, or
        print. These are general reference checklists, not a substitute for a formal safety audit or
        your local regulatory requirements. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Workplace type:
          <select value={workplace} onChange={(e) => setWorkplace(e.target.value)}>
            {Object.entries(WORKPLACE_CHECKLISTS).map(([key, w]) => (
              <option key={key} value={key}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy summary'}
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Progress:</strong> {checkedCount} / {current.items.length} items checked
        </div>
      </div>
      <div className="tool-panel">
        <label>{current.label} Checklist</label>
        <ul className="uuid-list">
          {current.items.map((item, i) => (
            <li key={i}>
              <label className="checkbox-label" style={{ flex: 1 }}>
                <input type="checkbox" checked={!!checked[`${workplace}-${i}`]} onChange={() => toggle(i)} />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
