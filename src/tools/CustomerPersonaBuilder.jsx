import { useState } from 'react';
export default function CustomerPersonaBuilder() {
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [occupation, setOccupation] = useState('');
  const [goals, setGoals] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [channels, setChannels] = useState('');
  const hasContent = name || ageRange || occupation || goals || painPoints || channels;
  return (
    <div className="tool-page">
      <h1>Customer Persona Builder</h1>
      <p className="tool-description">
        Fill in a customer persona's name, age range, occupation, goals, pain points, and preferred
        channels to render a clean summary card. A structured form template for organizing your own
        research - it does not generate any persona content or insight for you. Runs entirely in
        your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="persona-name">Persona name</label>
          <input id="persona-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Busy Brian" />
        </div>
        <div className="tool-panel">
          <label htmlFor="persona-age">Age range</label>
          <input id="persona-age" type="text" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} placeholder="e.g. 30-40" />
        </div>
        <div className="tool-panel">
          <label htmlFor="persona-occupation">Occupation</label>
          <input id="persona-occupation" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Marketing Manager" />
        </div>
        <div className="tool-panel">
          <label htmlFor="persona-channels">Preferred channels</label>
          <input id="persona-channels" type="text" value={channels} onChange={(e) => setChannels(e.target.value)} placeholder="e.g. Email, LinkedIn" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="persona-goals">Goals</label>
        <textarea id="persona-goals" value={goals} onChange={(e) => setGoals(e.target.value)} style={{ minHeight: '80px' }} placeholder="What is this customer trying to achieve?" />
      </div>
      <div className="tool-panel">
        <label htmlFor="persona-pain">Pain points</label>
        <textarea id="persona-pain" value={painPoints} onChange={(e) => setPainPoints(e.target.value)} style={{ minHeight: '80px' }} placeholder="What frustrates or blocks this customer?" />
      </div>
      {hasContent && (
        <div className="timestamp-result">
          <div>
            <strong>{name || 'Unnamed Persona'}</strong>
            {ageRange && <span> — {ageRange}</span>}
          </div>
          {occupation && (
            <div>
              <strong>Occupation:</strong> {occupation}
            </div>
          )}
          {goals && (
            <div>
              <strong>Goals:</strong> {goals}
            </div>
          )}
          {painPoints && (
            <div>
              <strong>Pain points:</strong> {painPoints}
            </div>
          )}
          {channels && (
            <div>
              <strong>Preferred channels:</strong> {channels}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
