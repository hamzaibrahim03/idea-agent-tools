import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const WORDS_PER_MINUTE = 130;
export default function ElevatorPitchBuilder() {
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [targetCustomer, setTargetCustomer] = useState('');
    const [uniqueValue, setUniqueValue] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('elevator-pitch', 'Elevator Pitch Builder');
    const pitch = ai.result?.pitch || '';
    const wordCount = pitch.trim() ? pitch.trim().split(/\s+/).length : 0;
    const estimatedSeconds = Math.round((wordCount / WORDS_PER_MINUTE) * 60);
    async function handleGenerate() {
        await ai.generate({ problem, solution, targetCustomer, uniqueValue });
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(pitch);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Elevator Pitch Builder</h1>
            <p className="tool-description">
                Answer four guided questions - problem, solution, target customer, and unique value - and
                click "Generate with AI" for a genuinely AI-written elevator pitch, with a word count and
                estimated speaking time - free, no account needed (rate-limited to keep it free for
                everyone).
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="pitch-customer">Target customer</label>
                    <input id="pitch-customer" type="text" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} placeholder="e.g. small restaurant owners" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="pitch-problem">Problem they face</label>
                    <input id="pitch-problem" type="text" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. tracking inventory manually wastes hours each week" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="pitch-solution">Your solution</label>
                    <input id="pitch-solution" type="text" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="e.g. an app that automates inventory tracking" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="pitch-value">Unique value</label>
                    <input id="pitch-value" type="text" value={uniqueValue} onChange={(e) => setUniqueValue(e.target.value)} placeholder="e.g. we integrate directly with your POS system" />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !problem.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!pitch}>
                    {copied ? 'Copied!' : 'Copy pitch'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {pitch ? (
                <div className="timestamp-result">
                    <div>{pitch}</div>
                    <div>
                        <strong>Word count:</strong> <code>{wordCount}</code>
                    </div>
                    <div>
                        <strong>Estimated speaking time:</strong> <code>~{estimatedSeconds}s</code>
                    </div>
                    {ai.result?.keyPoints?.length > 0 && (
                        <div>
                            <strong>Key points:</strong>
                            <ul>
                                {ai.result.keyPoints.map((k, i) => (
                                    <li key={i}>{k}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p className="tool-placeholder">Fill in the fields above and click Generate with AI.</p>
            )}
        </div>
    );
}
