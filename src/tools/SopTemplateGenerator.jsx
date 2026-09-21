import { useMemo, useState } from 'react';
function buildSop({ procedureName, purpose, role, steps }) {
  const name = procedureName.trim() || '[Procedure Name]';
  const purposeText = purpose.trim() || '[State the purpose of this procedure]';
  const roleText = role.trim() || '[Responsible role/title]';
  const stepLines = steps
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => `${i + 1}. ${s}`);
  const lines = [
    `Standard Operating Procedure: ${name}`,
    '',
    `Responsible Role: ${roleText}`,
    `Date Prepared: [date]`,
    `Version: 1.0`,
    '',
    'Purpose',
    purposeText,
    '',
    'Procedure Steps',
    ...(stepLines.length ? stepLines : ['[Add step-by-step instructions]']),
    '',
    'Notes',
    '[Add any exceptions, safety notes, or references here]'
  ];
  return lines.join('\n');
}
export default function SopTemplateGenerator() {
  const [procedureName, setProcedureName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [role, setRole] = useState('');
  const [steps, setSteps] = useState(['']);
  const [copied, setCopied] = useState(false);
  function updateStep(index, value) {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }
  function addStep() {
    setSteps((prev) => [...prev, '']);
  }
  function removeStep(index) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }
  const sop = useMemo(
    () => buildSop({ procedureName, purpose, role, steps }),
    [procedureName, purpose, role, steps]
  );
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sop);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>SOP Template Generator</h1>
      <p className="tool-description">
        Fill in a procedure name, purpose, step-by-step instructions, and the responsible role to
        assemble a structured Standard Operating Procedure document template. This is a starting
        template to edit and adapt - not a certified or industry-specific SOP. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addStep}>
          Add step
        </button>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy SOP'}</button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
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
      <div className="tool-panel">
        <label htmlFor="sop-output">Generated SOP</label>
        <textarea id="sop-output" value={sop} readOnly style={{ minHeight: 260, fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}
