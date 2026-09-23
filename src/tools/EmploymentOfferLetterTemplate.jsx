import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function EmploymentOfferLetterTemplate() {
    const [candidateName, setCandidateName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [startDate, setStartDate] = useState('');
    const [employmentType, setEmploymentType] = useState('Full-time');
    const [managerName, setManagerName] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('employment-offer-letter', 'Employment Offer Letter Template');
    const letter = ai.result?.letter || '';
    async function handleGenerate() {
        await ai.generate({ candidateName, companyName, position, salary, startDate, employmentType, managerName });
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
            <h1>Employment Offer Letter Template</h1>
            <p className="tool-description">
                Fill in the details below and click "Generate with AI" for a genuinely AI-written employment
                offer letter with position, salary, start date, and employment type - free, no account
                needed (rate-limited to keep it free for everyone).
            </p>
            <div className="tool-error">
                <strong>Not legal advice:</strong> This is a starting template only. Employment law
                requirements vary by jurisdiction - have your HR team and/or a qualified lawyer review any
                offer letter before sending it to a candidate.
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ol-candidate">Candidate name</label>
                    <input id="ol-candidate" type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-company">Company name</label>
                    <input id="ol-company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-position">Position title</label>
                    <input id="ol-position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-salary">Salary</label>
                    <input id="ol-salary" type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$75,000/year" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-start">Start date</label>
                    <input id="ol-start" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="October 1, 2026" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-type">Employment type</label>
                    <select id="ol-type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Temporary</option>
                        <option>Internship</option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="ol-manager">Hiring manager name</label>
                    <input id="ol-manager" type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !candidateName.trim() || !position.trim()}>
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
                <label>Generated offer letter</label>
                <textarea readOnly value={letter} placeholder="Fill in the details above and click Generate with AI" style={{ minHeight: 300 }} />
            </div>
        </div>
    );
}
