import { useState } from 'react';
const SECTIONS = [
  {
    name: 'Exterior',
    items: [
      'Siding/exterior walls free of cracks or damage',
      'Foundation free of visible cracks or settling',
      'Grading slopes away from the house',
      'Driveway and walkways in good condition',
      'Windows and doors seal properly',
      'Paint/finish in good condition'
    ]
  },
  {
    name: 'Roof',
    items: [
      'Shingles/tiles intact, no missing or curling pieces',
      'Gutters and downspouts clear and secure',
      'Flashing around chimneys/vents intact',
      'No visible sagging or water stains on ceiling below',
      'Attic ventilation present and unobstructed'
    ]
  },
  {
    name: 'Plumbing',
    items: [
      'Water pressure adequate at faucets',
      'No visible leaks under sinks or around toilets',
      'Water heater in good condition, no rust or leaks',
      'Drains clear, no slow drainage',
      'Visible pipes free of corrosion'
    ]
  },
  {
    name: 'Electrical',
    items: [
      'Electrical panel labeled and free of rust/damage',
      'Outlets and switches functional',
      'GFCI outlets present in kitchen/bathrooms',
      'No exposed or frayed wiring',
      'Light fixtures secure and functional'
    ]
  },
  {
    name: 'HVAC',
    items: [
      'Heating system turns on and runs properly',
      'Air conditioning cools effectively',
      'Filters clean or recently replaced',
      'Ductwork visible and free of damage',
      'Thermostat functions correctly'
    ]
  },
  {
    name: 'Interior',
    items: [
      'Walls and ceilings free of major cracks or stains',
      'Floors level, no soft spots or excessive creaking',
      'Doors and windows open/close smoothly',
      'No signs of pests or mold',
      'Appliances (if included) power on and function'
    ]
  }
];
export default function PropertyInspectionChecklist() {
  const [checked, setChecked] = useState({});
  function toggle(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function resetAll() {
    setChecked({});
  }
  const totalItems = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  return (
    <div className="tool-page">
      <h1>Property Inspection Checklist</h1>
      <p className="tool-description">
        A general-purpose walkthrough checklist covering exterior, roof, plumbing, electrical,
        HVAC, and interior items to look at when viewing a property. This is a reference checklist,
        not a substitute for a licensed professional home inspection. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <strong>
          Progress: {checkedCount} / {totalItems}
        </strong>
        <button type="button" onClick={resetAll} disabled={checkedCount === 0}>
          Reset checklist
        </button>
      </div>
      {SECTIONS.map((section) => (
        <div className="tool-panel" key={section.name}>
          <label>{section.name}</label>
          {section.items.map((item) => {
            const key = `${section.name}::${item}`;
            return (
              <label className="checkbox-label" key={key}>
                <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} />
                {item}
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
