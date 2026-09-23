import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function InterviewQuestionGenerator() {
    const [role, setRole] = useState('');
    const [level, setLevel] = useState('');
    const ai = useAiGenerate('interview-questions', 'Interview Question Generator');
    const questions = ai.result?.questions || [];
    async function handleGenerate() {
        await ai.generate({ role, level });
    }
    return (
        <div className="tool-page">
            <h1>Interview Question Generator</h1>
            <p className="tool-description">
                Describe the job role and click "Generate with AI" for a genuinely AI-written set of
                interview questions tailored to that role - free, no account needed (rate-limited to keep
                it free for everyone).
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="iq-role">Job role</label>
                    <input id="iq-role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Software Engineer" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="iq-level">Seniority / level (optional)</label>
                    <input id="iq-level" type="text" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. Mid-level, Manager, Entry-level" />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !role.trim()}>
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
            {questions.length > 0 && (
                <>
                    <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>{role} questions</h2>
                    <ul className="uuid-list">
                        {questions.map((q, i) => (
                            <li key={i}>
                                <span>{q}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {!questions.length && !ai.loading && (
                <p className="tool-placeholder">Fill in the role above and click Generate with AI to see interview questions here.</p>
            )}
        </div>
    );
}
