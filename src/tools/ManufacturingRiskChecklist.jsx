import { useState } from 'react';
const SECTIONS = [
  {
    section: 'Machine Safety',
    items: [
      'Machine guards in place and functional on all equipment',
      'Emergency stop buttons accessible and tested',
      'Lockout/tagout (LOTO) procedures followed for maintenance',
      'Operators trained on machine-specific safety procedures',
      'Moving parts and pinch points clearly marked'
    ]
  },
  {
    section: 'Chemical Handling',
    items: [
      'Safety Data Sheets (SDS) available for all chemicals on site',
      'Chemicals stored in labeled, compatible containers',
      'Spill kits available near chemical storage and use areas',
      'Ventilation adequate in areas with chemical use',
      'Incompatible chemicals stored separately'
    ]
  },
  {
    section: 'Personal Protective Equipment (PPE)',
    items: [
      'Safety glasses/goggles available and worn where required',
      'Hearing protection available in high-noise areas',
      'Gloves appropriate to task (cut, chemical, heat resistant as needed)',
      'Steel-toe or safety footwear required in production areas',
      'PPE inspected regularly and replaced when worn'
    ]
  },
  {
    section: 'Fire Safety',
    items: [
      'Fire extinguishers accessible, charged, and inspected',
      'Fire exits clearly marked and unobstructed',
      'Flammable materials stored in approved cabinets',
      'Fire alarm and sprinkler systems tested per schedule',
      'Evacuation plan posted and staff trained'
    ]
  },
  {
    section: 'Electrical Safety',
    items: [
      'Electrical panels accessible and unobstructed',
      'Cords and cables inspected for damage, not run across walkways',
      'Equipment properly grounded',
      'Only qualified personnel perform electrical work',
      'Wet or hazardous areas use appropriately rated equipment'
    ]
  }
];
function itemKey(sectionIdx, itemIdx) {
  return `${sectionIdx}-${itemIdx}`;
}
export default function ManufacturingRiskChecklist() {
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
    const lines = ['Manufacturing Risk Checklist Summary', ''];
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
      <h1>Manufacturing Risk Checklist</h1>
      <p className="tool-description">
        A reference checklist covering common manufacturing floor risk areas - machine safety,
        chemical handling, PPE, fire safety, and electrical safety - with items you can check off as
        you go. Copy or print a summary of checked vs. unchecked items. This is a general reference
        checklist, not a substitute for a formal safety audit or your local regulatory requirements.
        Runs entirely in your browser.
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
