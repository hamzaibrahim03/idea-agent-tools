import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function SopTemplateGenerator() {
  const [procedureName, setProcedureName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [role, setRole] = useState('');
  const [steps, setSteps] = useState(['']);
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('sop-template', 'SOP Template Generator');
  const sop = ai.result;
  function updateStep(index, value) {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }
  function addStep() {
    setSteps((prev) => [...prev, '']);
  }
  function removeStep(index) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleGenerate() {
    const stepList = steps.map((s) => s.trim()).filter(Boolean).join('; ');
    await ai.generate({ procedureName, purpose, role, steps: stepList });
  }
  function buildText() {
    if (!sop) return '';
    const lines = [
      `Standard Operating Procedure: ${sop.title || procedureName}`,
      '',
      'Purpose',
      sop.purpose || '',
      '',
      'Procedure Steps',
      ...(sop.steps || []).map((s) => `${s.stepNumber}. ${s.instruction}`)
    ];
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
      <h1>SOP Template Generator</h1>
      <p className="tool-description">
        Fill in a procedure name, purpose, step-by-step instructions, and the responsible role,
        then click "Generate with AI" for a genuinely AI-generated Standard Operating Procedure
        document - free, no account needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addStep}>
          Add step
        </button>
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !procedureName.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button onClick={handleCopy} disabled={!sop}>{copied ? 'Copied!' : 'Copy SOP'}</button>
        <button type="button" onClick={() => window.print()} disabled={!sop}>
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
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sop-name">Procedure name</label>
          <input id="sop-name" type="text" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} placeholder="e.g. Machine Startup Procedure" />
        </div>
        <div className="tool-panel">
          <label htmlFor="sop-role">Responsible role</label>
          <input id="sop-role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Line Supervisor" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="sop-purpose">Purpose</label>
        <textarea id="sop-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe why this procedure exists" style={{ minHeight: 80 }} />
      </div>
      <div className="tool-panel">
        <label>Step-by-step instructions</label>
        {steps.map((s, i) => (
          <div key={i} className="tool-controls" style={{ marginTop: 6 }}>
            <input
              type="text"
              value={s}
              onChange={(e) => updateStep(i, e.target.value)}
              placeholder={`Step ${i + 1}`}
              style={{ flex: 1 }}
            />
            <button type="button" className="uuid-copy-btn" onClick={() => removeStep(i)} disabled={steps.length <= 1}>
              Remove
            </button>
          </div>
        ))}
      </div>
      {sop && (
        <>
          <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>{sop.title}</h2>
          {sop.purpose && (
            <div className="tool-panel">
              <label>Purpose</label>
              <p style={{ margin: 0 }}>{sop.purpose}</p>
            </div>
          )}
          <ul className="uuid-list">
            {(sop.steps || []).map((s, i) => (
              <li key={i}>
                <span>
                  {s.stepNumber ?? i + 1}. {s.instruction}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
