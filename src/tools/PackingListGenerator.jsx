import { useState } from 'react';
const TRIP_TYPES = {
  beach: {
    label: 'Beach',
    items: [
      'Swimsuit', 'Sunscreen', 'Sunglasses', 'Beach towel', 'Flip-flops', 'Hat',
      'After-sun lotion', 'Beach bag', 'Light cover-up', 'Waterproof phone pouch'
    ]
  },
  business: {
    label: 'Business',
    items: [
      'Suit / business attire', 'Dress shoes', 'Laptop and charger', 'Business cards',
      'Notebook and pen', 'Phone charger', 'Portable battery pack', 'Travel iron / steamer',
      'Dress belt', 'Toiletry bag'
    ]
  },
  camping: {
    label: 'Camping',
    items: [
      'Tent', 'Sleeping bag', 'Sleeping pad', 'Headlamp / flashlight', 'Camp stove',
      'Water filter or purification tablets', 'First aid kit', 'Multi-tool / knife',
      'Insect repellent', 'Extra socks', 'Fire starter'
    ]
  },
  winter: {
    label: 'Winter',
    items: [
      'Insulated jacket', 'Thermal base layers', 'Gloves', 'Winter hat', 'Scarf',
      'Waterproof boots', 'Wool socks', 'Hand warmers', 'Lip balm', 'Moisturizer'
    ]
  },
  general: {
    label: 'General',
    items: [
      'Passport / ID', 'Phone charger', 'Toothbrush and toothpaste', 'Underwear and socks',
      'Comfortable shoes', 'Medications', 'Travel adapter', 'Reusable water bottle',
      'Basic first aid items', 'Laundry bag'
    ]
  }
};
const PER_DAY_ITEM = 'Change of clothes';
export default function PackingListGenerator() {
  const [tripType, setTripType] = useState('beach');
  const [days, setDays] = useState(5);
  const [checked, setChecked] = useState({});
  const daysNum = Math.max(1, parseInt(days, 10) || 1);
  const baseItems = TRIP_TYPES[tripType].items;
  const items = [...baseItems, `${PER_DAY_ITEM} (${daysNum}x for ${daysNum}-day trip)`];
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Packing List Generator</h1>
      <p className="tool-description">
        Pick a trip type and length to get a curated packing checklist from a built-in reference
        list, with checkboxes to track what you've packed. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Trip type:
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            {Object.entries(TRIP_TYPES).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </label>
        <label>
          Trip length (days):
          <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      <div className="tool-panel">
        <label>
          Packing checklist ({checkedCount}/{items.length} packed)
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
