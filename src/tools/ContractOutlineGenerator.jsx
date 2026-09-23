import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function ContractOutlineGenerator() {
    const [partyA, setPartyA] = useState('');
    const [partyB, setPartyB] = useState('');
    const [purpose, setPurpose] = useState('');
    const [terms, setTerms] = useState('');
    const [payment, setPayment] = useState('');
    const [duration, setDuration] = useState('');
    const [termination, setTermination] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('contract-outline', 'Contract Outline Generator');
    const title = ai.result?.title || '';
    const sections = ai.result?.sections || [];
    async function handleGenerate() {
        await ai.generate({ partyA, partyB, purpose, terms, payment, duration, termination });
    }
    function assembleText() {
        const lines = [title, ''];
        sections.forEach((s, i) => {
            lines.push(`${i + 1}. ${s.heading}`);
            lines.push(s.content);
            lines.push('');
        });
        return lines.join('\n');
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(assembleText());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Contract Outline Generator</h1>
            <p className="tool-description">
                Fill in the basic details below and click "Generate with AI" for a genuinely AI-written
                generic contract structure outline - parties, purpose, terms, payment, duration, and
                termination - tailored to your details. Free, no account needed (rate-limited to keep it
                free for everyone).
            </p>
            <div className="tool-error">
                <strong>Not legal advice:</strong> This is an educational template only, not a legally
                binding document as-is. Consult a qualified lawyer before using any generated document.
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="co-a">Party A</label>
                    <input id="co-a" type="text" value={partyA} onChange={(e) => setPartyA(e.target.value)} placeholder="Acme Corp" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="co-b">Party B</label>
                    <input id="co-b" type="text" value={partyB} onChange={(e) => setPartyB(e.target.value)} placeholder="Jane Doe" />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="co-purpose">Purpose</label>
                <textarea id="co-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="co-terms">Key terms</label>
                <textarea id="co-terms" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="co-payment">Payment</label>
                <textarea id="co-payment" value={payment} onChange={(e) => setPayment(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="co-duration">Duration</label>
                <input id="co-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="12 months" />
            </div>
            <div className="tool-panel">
                <label htmlFor="co-termination">Termination clause</label>
                <textarea id="co-termination" value={termination} onChange={(e) => setTermination(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !partyA.trim() || !partyB.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!sections.length}>
                    {copied ? 'Copied!' : 'Copy all'}
                </button>
                <button type="button" onClick={() => window.print()} disabled={!sections.length}>
                    Print
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {sections.length > 0 && (
                <div className="tool-panel">
                    {title && <h2>{title}</h2>}
                    {sections.map((s, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <h3>
                                {i + 1}. {s.heading}
                            </h3>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{s.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
