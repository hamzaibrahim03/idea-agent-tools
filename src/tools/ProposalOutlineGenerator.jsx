import { useState } from 'react';
const SECTIONS = [
  { title: 'Problem Statement', prompt: "The client's current challenge or need, in their own terms." },
  { title: 'Proposed Solution', prompt: 'What you will do to solve it, and why your approach is the right one.' },
  { title: 'Scope of Work', prompt: 'Specific deliverables included (and, if useful, what is excluded).' },
  { title: 'Timeline', prompt: 'Key milestones and an estimated completion date.' },
  { title: 'Pricing', prompt: 'Cost breakdown and payment schedule.' },
  { title: 'Terms', prompt: 'Terms of engagement: revisions, cancellation policy, ownership of work.' },
  { title: 'Next Steps', prompt: 'What the client needs to do to move forward (e.g. sign, deposit).' }
];
export default function ProposalOutlineGenerator() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [copied, setCopied] = useState(false);
  function buildText() {
    const header = `Proposal: ${projectName || '[Project Name]'} — for ${clientName || '[Client Name]'}`;
    const lines = [header, ''];
    SECTIONS.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}`);
      lines.push(`   ${s.prompt}`);
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
      <h1>Proposal Outline Generator</h1>
      <p className="tool-description">
        Enter a project name and client to generate a structured proposal outline (problem
        statement, proposed solution, timeline, pricing, terms) as a fill-in template. A fixed
        structural template, not an AI-generated proposal. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="prop-project">Project name</label>
          <input id="prop-project" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Website Redesign" />
        </div>
        <div className="tool-panel">
          <label htmlFor="prop-client">Client name</label>
          <input id="prop-client" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Acme Corp" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
      <ul className="uuid-list">
        {SECTIONS.map((s, i) => (
          <li key={s.title} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong>
              {i + 1}. {s.title}
            </strong>
            <span style={{ opacity: 0.75, fontSize: '13px' }}>{s.prompt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
