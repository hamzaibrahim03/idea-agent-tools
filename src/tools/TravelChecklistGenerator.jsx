import { useState } from 'react';
const DOMESTIC_ITEMS = [
  'Government-issued photo ID', 'Boarding pass / tickets', 'Hotel confirmation',
  'Payment cards and some cash', 'Phone charger', 'Medications',
  'Weather-appropriate clothing', 'Emergency contact list', 'Copy of itinerary shared with someone at home'
];
const INTERNATIONAL_ITEMS = [
  'Valid passport (check expiration date - many countries require 6+ months validity)',
  'Visa (check requirements for your destination)',
  'Travel insurance', 'Vaccination records / health requirements reminder',
  'Local currency or a card with no foreign transaction fees',
  'Power plug adapter', 'Copies of important documents (passport photo page, itinerary)',
  'Emergency contacts and embassy/consulate info', 'International phone plan or SIM',
  'Check travel advisories for your destination'
];
export default function TravelChecklistGenerator() {
  const [destinationType, setDestinationType] = useState('international');
  const [checked, setChecked] = useState({});
  const items = destinationType === 'international' ? INTERNATIONAL_ITEMS : DOMESTIC_ITEMS;
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Travel Checklist Generator</h1>
      <p className="tool-description">
        Pick a destination type to get a curated pre-trip checklist - passport, visa, insurance,
        vaccinations reminder, currency, adapters - from a built-in reference list, with checkboxes.
        This is a general reminder checklist, not a lookup of your specific destination's actual
        requirements - always verify current passport/visa/vaccination rules with official sources.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Destination type:
          <select value={destinationType} onChange={(e) => setDestinationType(e.target.value)}>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>
          Pre-trip checklist ({checkedCount}/{items.length} done)
        </label>
        {items.map((item) => (
          <label key={item} className="checkbox-label" style={{ padding: '4px 0' }}>
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
            <span style={{ textDecoration: checked[item] ? 'line-through' : 'none', opacity: checked[item] ? 0.5 : 1 }}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
