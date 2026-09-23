import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function CoverLetterGenerator() {
    const [yourName, setYourName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [hiringManager, setHiringManager] = useState('');
    const [skills, setSkills] = useState('');
    const [achievement, setAchievement] = useState('');
    const [whyCompany, setWhyCompany] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('cover-letter', 'Cover Letter Generator');
    const letter = ai.result?.letter || '';
    async function handleGenerate() {
        await ai.generate({ yourName, jobTitle, company, hiringManager, skills, achievement, whyCompany });
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
            <h1>Cover Letter Generator</h1>
            <p className="tool-description">
                Fill in the fields below and click "Generate with AI" for a genuinely AI-written cover
                letter tailored to your details - free, no account needed (rate-limited to keep it free
                for everyone). Review and personalize the result before sending.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cl-name">Your name</label>
                    <input id="cl-name" type="text" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="Jordan Smith" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cl-manager">Hiring manager's name (optional)</label>
                    <input id="cl-manager" type="text" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="Alex Rivera" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cl-title">Job title</label>
                    <input id="cl-title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Product Manager" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cl-company">Company</label>
                    <input id="cl-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="cl-skills">Key skills (comma-separated)</label>
                <input id="cl-skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="project management, data analysis, stakeholder communication" />
            </div>
            <div className="tool-panel">
                <label htmlFor="cl-achievement">A key achievement</label>
                <textarea id="cl-achievement" value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder="I led a cross-functional team that shipped a new feature ahead of schedule, increasing user engagement by 20%." style={{ minHeight: 70 }} />
            </div>
            <div className="tool-panel">
                <label htmlFor="cl-why">Why this company</label>
                <textarea id="cl-why" value={whyCompany} onChange={(e) => setWhyCompany(e.target.value)} placeholder="your focus on sustainable technology matches my own career goals." style={{ minHeight: 70 }} />
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !jobTitle.trim()}>
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
                <textarea readOnly value={letter} placeholder="Fill in the fields above and click Generate with AI" style={{ minHeight: 300 }} />
            </div>
        </div>
    );
}
