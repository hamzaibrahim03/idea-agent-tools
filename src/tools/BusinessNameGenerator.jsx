import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function BusinessNameGenerator() {
    const [keyword, setKeyword] = useState('');
    const ai = useAiGenerate('business-name', 'Business Name Generator');
    const names = ai.result?.names || [];
    async function handleGenerate() {
        await ai.generate({ keyword });
    }
    return (
        <div className="tool-page">
            <h1>Business Name Generator</h1>
            <p className="tool-description">
                Enter a keyword or industry and click "Generate with AI" for genuinely AI-generated business
                name ideas tailored to your keyword - free, no account needed (rate-limited to keep it free
                for everyone). This does not check trademark or domain availability, so verify any name you
                like separately before using it.
            </p>
            <div className="tool-controls">
                <label>
                    Keyword / industry:
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Bakery" style={{ minWidth: '200px' }} />
                </label>
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !keyword.trim()}>
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
            {names.length === 0 && !ai.loading && <p className="tool-placeholder">Enter a keyword and generate to see name suggestions.</p>}
            {names.length > 0 && (
                <>
                    <ul className="uuid-list">
                        {names.map((s) => (
                            <li key={s}>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                    {ai.result?.notes && <p className="tool-placeholder">{ai.result.notes}</p>}
                </>
            )}
        </div>
    );
}
