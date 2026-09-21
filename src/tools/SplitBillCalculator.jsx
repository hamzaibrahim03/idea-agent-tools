import { useState } from 'react';
export default function SplitBillCalculator() {
  const [total, setTotal] = useState('100');
  const [people, setPeople] = useState([
    { name: 'Person 1', share: '1' },
    { name: 'Person 2', share: '1' }
  ]);
  function updatePerson(index, field, value) {
    setPeople((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }
  function addPerson() {
    setPeople((prev) => [...prev, { name: `Person ${prev.length + 1}`, share: '1' }]);
  }
  function removePerson(index) {
    setPeople((prev) => prev.filter((_, i) => i !== index));
  }
  const totalNum = Number(total);
  const shares = people.map((p) => Number(p.share) || 0);
  const totalShares = shares.reduce((sum, s) => sum + s, 0);
  const valid = Number.isFinite(totalNum) && totalNum >= 0 && totalShares > 0;
  const amounts = valid ? shares.map((s) => (totalNum * s) / totalShares) : [];
  return (
    <div className="tool-page">
      <h1>Split Bill Calculator</h1>
      <p className="tool-description">
        Split a bill between any number of people, either evenly or by custom shares (e.g. someone
        ordered more, so they get 2 shares vs. everyone else's 1). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Total bill:
          <input type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} style={{ width: '100px' }} />
        </label>
        <button type="button" onClick={addPerson}>
          Add person
        </button>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative bill total and at least one person with a positive share.
        </div>
      )}
      <ul className="uuid-list">
        {people.map((p, i) => (
          <li key={i}>
            <input
              type="text"
              value={p.name}
              onChange={(e) => updatePerson(i, 'name', e.target.value)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <label style={{ marginRight: 8 }}>
              Shares:
              <input
                type="number"
                min={0}
                step="0.5"
                value={p.share}
                onChange={(e) => updatePerson(i, 'share', e.target.value)}
                style={{ width: '60px', marginLeft: 4 }}
              />
            </label>
            <code>{valid ? amounts[i].toFixed(2) : '—'}</code>
            <button type="button" className="uuid-copy-btn" onClick={() => removePerson(i)} disabled={people.length <= 1}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
