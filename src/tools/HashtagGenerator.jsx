import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function HashtagGenerator() {
    const [topic, setTopic] = useState('');
    const [copied, setCopied] = useState('');
    const ai = useAiGenerate('hashtags', 'Hashtag Generator');
    const hashtags = ai.result?.hashtags || [];
    async function handleGenerate() {
        await ai.generate({ topic });
    }
    async function handleCopyOne(tag) {
        try {
            await navigator.clipboard.writeText(tag);
            setCopied(tag);
            setTimeout(() => setCopied(''), 1200);
        } catch {
        }
    }
    async function handleCopyAll() {
        if (hashtags.length === 0) return;
        try {
            await navigator.clipboard.writeText(hashtags.join(' '));
            setCopied('__all__');
            setTimeout(() => setCopied(''), 1200);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Hashtag Generator</h1>
            <p className="tool-description">
                Enter a topic or keyword and click "Generate with AI" for a genuinely AI-generated set of
                relevant hashtags mixing broad and niche tags - free, no account needed (rate-limited to
                keep it free for everyone).
            </p>
            <div className="tool-panel">
                <label htmlFor="hashtag-topic">Topic / keyword</label>
                <input id="hashtag-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. morning routine" />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button onClick={handleCopyAll} disabled={hashtags.length === 0}>
                    {copied === '__all__' ? 'Copied!' : 'Copy all'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {hashtags.length > 0 ? (
                <>
                    <ul className="uuid-list">
                        {hashtags.map((tag) => (
                            <li key={tag}>
                                <code>{tag}</code>
                                <button className="uuid-copy-btn" onClick={() => handleCopyOne(tag)}>
                                    {copied === tag ? 'Copied!' : 'Copy'}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {ai.result?.notes && <p className="tool-placeholder">{ai.result.notes}</p>}
                </>
            ) : (
                <p className="tool-placeholder">Enter a topic and generate to see hashtag suggestions.</p>
            )}
        </div>
    );
}
