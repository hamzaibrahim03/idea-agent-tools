import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function ProposalOutlineGenerator() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('proposal-outline', 'Proposal Outline Generator');
  const outline = ai.result;
  async function handleGenerate() {
    await ai.generate({ projectName, clientName });
  }
  function buildText() {
    if (!outline) return '';
    const lines = [outline.title || `Proposal: ${projectName}`, ''];
    (outline.sections || []).forEach((s, i) => {
      lines.push(`${i + 1}. ${s.heading}`);
      lines.push(`   ${s.content}`);
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
        Enter a project name and client and click "Generate with AI" for a genuinely AI-generated
        proposal outline - problem statement, proposed solution, timeline, pricing, terms - free,
        no account needed (rate-limited to keep it free for everyone).
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
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !projectName.trim()}>
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
              <li key={s.heading + i} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <strong>
                  {i + 1}. {s.heading}
                </strong>
                <span style={{ opacity: 0.85, fontSize: '13px' }}>{s.content}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
