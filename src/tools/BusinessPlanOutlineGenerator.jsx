import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function BusinessPlanOutlineGenerator() {
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('business-plan-outline', 'Business Plan Outline Generator');
    const outline = ai.result;
    async function handleGenerate() {
        await ai.generate({ businessName, businessType });
    }
    function buildText() {
        if (!outline) return '';
        const lines = [outline.title || businessName, ''];
        (outline.sections || []).forEach((s, i) => {
            lines.push(`${i + 1}. ${s.heading}`);
            (s.guidingPrompts || []).forEach((p) => lines.push(`   - ${p}`));
            lines.push('');
        });
        return lines.join('\n');
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(buildText());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Business Plan Outline Generator</h1>
            <p className="tool-description">
                Enter your business name and type and click "Generate with AI" for a genuinely
                AI-generated business plan outline - the standard sections investors and lenders
                expect, each with guiding prompts tailored to your business - free, no account
                needed (rate-limited to keep it free for everyone).
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="bp-name">Business name</label>
                    <input id="bp-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Riverside Coffee Co." />
                </div>
                <div className="tool-panel">
                    <label htmlFor="bp-type">Business type / industry</label>
                    <input id="bp-type" type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Cafe, SaaS, Consulting" />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !businessName.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!outline}>
                    {copied ? 'Copied!' : 'Copy outline'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {outline && (
                <>
                    <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>{outline.title}</h2>
                    <ul className="uuid-list">
                        {(outline.sections || []).map((s, i) => (
                            <li key={s.heading + i} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                <strong>
                                    {i + 1}. {s.heading}
                                </strong>
                                {(s.guidingPrompts || []).length > 0 && (
                                    <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                                        {s.guidingPrompts.map((p, j) => (
                                            <li key={j} style={{ fontSize: 13, opacity: 0.85 }}>{p}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
