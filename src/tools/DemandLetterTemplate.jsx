import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function DemandLetterTemplate() {
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [amountOwed, setAmountOwed] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('demand-letter', 'Demand Letter Template');
    const letter = ai.result?.letter || '';
    async function handleGenerate() {
        await ai.generate({ sender, recipient, amountOwed, issueDescription, deadline });
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(letter);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Demand Letter Template</h1>
            <p className="tool-description">
                Fill in the details below and click "Generate with AI" for a genuinely AI-written formal
                demand letter requesting payment or resolution of an issue by a deadline - free, no account
                needed (rate-limited to keep it free for everyone).
            </p>
            <div className="tool-error">
                <strong>Not legal advice:</strong> This is an educational template only. Demand letters can
                have legal consequences and requirements vary by situation and jurisdiction - consult a
                qualified lawyer before sending a real demand letter.
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="dl-sender">Your name</label>
                    <input id="dl-sender" type="text" value={sender} onChange={(e) => setSender(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="dl-recipient">Recipient name</label>
                    <input id="dl-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="dl-amount">Amount owed (optional)</label>
                    <input id="dl-amount" type="text" value={amountOwed} onChange={(e) => setAmountOwed(e.target.value)} placeholder="$1,200" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="dl-deadline">Deadline to resolve</label>
                    <input id="dl-deadline" type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="14 days from the date of this letter" />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="dl-issue">Description of issue</label>
                <textarea id="dl-issue" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} style={{ minHeight: 90 }} />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !issueDescription.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!letter}>
                    {copied ? 'Copied!' : 'Copy letter'}
                </button>
                <button type="button" onClick={() => window.print()} disabled={!letter}>
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
            <div className="tool-panel">
                <label>Generated letter</label>
                <textarea readOnly value={letter} placeholder="Fill in the details above and click Generate with AI" style={{ minHeight: 280 }} />
            </div>
        </div>
    );
}
