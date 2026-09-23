import { createComputeHandler } from '../computeHandler.js';

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

function compute({ checked }) {
  const checkedMap = checked && typeof checked === 'object' ? checked : {};
  const totalItems = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checkedMap).filter(Boolean).length;
  const lines = ['Manufacturing Risk Checklist Summary', ''];
  SECTIONS.forEach((s, si) => {
    lines.push(s.section + ':');
    s.items.forEach((item, ii) => {
      const done = checkedMap[itemKey(si, ii)];
      lines.push(`  [${done ? 'x' : ' '}] ${item}`);
    });
    lines.push('');
  });
  lines.push(`Completed: ${checkedCount} / ${totalItems}`);
  const summary = lines.join('\n');
  return { sections: SECTIONS, totalItems, checkedCount, summary };
}

export default createComputeHandler(compute);
