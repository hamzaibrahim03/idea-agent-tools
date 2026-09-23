import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const EMAIL_TYPES = [
    { key: 'follow-up', label: 'Follow-up' },
    { key: 'meeting-request', label: 'Meeting Request' },
    { key: 'introduction', label: 'Introduction' },
    { key: 'thank-you', label: 'Thank You' },
    { key: 'apology', label: 'Apology' }
];
export default function BusinessEmailTemplateGenerator() {
    const [type, setType] = useState('follow-up');
    const [recipient, setRecipient] = useState('');
    const [topic, setTopic] = useState('');
    const [sender, setSender] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('business-email-template', 'Business Email Template Generator');
    const subject = ai.result?.subject || '';
    const email = ai.result?.email || '';
    async function handleGenerate() {
        const typeLabel = EMAIL_TYPES.find((t) => t.key === type)?.label || type;
        await ai.generate({ emailType: typeLabel, recipient, topic, sender });
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(`Subject: ${subject}\n\n${email}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Business Email Template Generator</h1>
            <p className="tool-description">
                Pick an email type and fill in the recipient, topic, and your name, then click "Generate
                with AI" for a genuinely AI-written professional email draft - free, no account needed
                (rate-limited to keep it free for everyone). Review and personalize the result before
                sending.
            </p>
            <div className="tool-controls">
                <label>
                    Email type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {EMAIL_TYPES.map((t) => (
                            <option key={t.key} value={t.key}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="email-recipient">Recipient name</label>
                    <input id="email-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="email-sender">Your name</label>
                    <input id="email-sender" type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g. Alex" />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="email-topic">Topic / subject matter</label>
                <input id="email-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. the proposal we discussed" />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!email}>
                    {copied ? 'Copied!' : 'Copy email'}
                </button>
                <button type="button" onClick={() => window.print()} disabled={!email}>
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
            <div className="timestamp-result">
                <div>
                    <strong>Subject:</strong> {subject}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{email}</div>
            </div>
        </div>
    );
}
