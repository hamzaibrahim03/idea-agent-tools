import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function CustomerPersonaBuilder() {
    const [name, setName] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [occupation, setOccupation] = useState('');
    const [goals, setGoals] = useState('');
    const [painPoints, setPainPoints] = useState('');
    const [channels, setChannels] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const ai = useAiGenerate('customer-persona', 'Customer Persona Builder');
    const hasContent = name || ageRange || occupation || goals || painPoints || channels;
    async function handleGenerate() {
        const data = await ai.generate({ productDescription });
        if (!data) return;
        if (data.name) setName(data.name);
        if (data.demographics) setAgeRange(data.demographics);
        if (data.summary) setOccupation(data.summary);
        if (Array.isArray(data.goals)) setGoals(data.goals.join('\n'));
        if (Array.isArray(data.painPoints)) setPainPoints(data.painPoints.join('\n'));
        if (Array.isArray(data.preferredChannels)) setChannels(data.preferredChannels.join(', '));
    }
    return (
        <div className="tool-page">
            <h1>Customer Persona Builder</h1>
            <p className="tool-description">
                Fill in a customer persona's name, age range, occupation, goals, pain points, and preferred
                channels to render a clean summary card - or describe your product/business below and click
                "Generate with AI" to have a persona suggested for you, which you can then edit freely.
            </p>
            <div className="tool-panel">
                <label htmlFor="persona-product">Product / business description</label>
                <textarea id="persona-product" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} style={{ minHeight: '80px' }} placeholder="e.g. A subscription meal-kit service for busy young professionals" />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !productDescription.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
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
