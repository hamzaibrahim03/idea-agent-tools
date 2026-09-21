import { useState } from 'react';
const SECTIONS = [
  {
    section: 'Foundation',
    items: [
      'Excavation depth matches approved drawings',
      'Soil bearing capacity verified',
      'Reinforcement placed per structural drawings',
      'Formwork is plumb, level, and properly braced',
      'Concrete cured for required duration before backfill'
    ]
  },
  {
    section: 'Framing / Structure',
    items: [
      'Structural members sized and spaced per drawings',
      'Connections and fasteners meet code',
      'Load-bearing walls correctly positioned',
      'Bracing and shear walls installed',
      'Framing is plumb and square'
    ]
  },
  {
    section: 'Electrical Rough-In',
    items: [
      'Wiring gauge matches load requirements',
      'Boxes and panels securely mounted and labeled',
      'Grounding and bonding complete',
      'Wiring protected from physical damage (nail plates, conduit)',
      'Rough-in inspected before wall closure'
    ]
  },
  {
    section: 'Plumbing',
    items: [
      'Pipe sizing and materials match approved plans',
      'Slope on drain lines meets code minimum',
      'Pressure test performed on supply lines',
      'Vent stacks properly installed',
      'No visible leaks at joints and fittings'
    ]
  },
  {
    section: 'Finishing',
    items: [
      'Surfaces clean, level, and free of defects before finish coats',
      'Paint/finish materials match approved specification',
      'Fixtures and fittings installed and functional',
      'Punch list items documented',
      'Site cleaned of construction debris'
    ]
  }
];
function itemKey(sectionIdx, itemIdx) {
  return `${sectionIdx}-${itemIdx}`;
}
export default function SiteInspectionChecklist() {
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
    const lines = ['Site Inspection Checklist Summary', ''];
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
      <h1>Site Inspection Checklist</h1>
      <p className="tool-description">
        A structured checklist covering common construction site inspection points - foundation,
        framing, electrical rough-in, plumbing, and finishing - with sub-items you can check off as
        you go. Copy or print a summary of checked vs. unchecked items. This is a general reference
        checklist, not a substitute for your jurisdiction's official inspection requirements or a
        licensed inspector's sign-off. Runs entirely in your browser.
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
