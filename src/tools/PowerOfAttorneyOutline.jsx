import { useState } from 'react';
const POWER_OPTIONS = [
  { key: 'financial', label: 'Financial affairs (banking, bills, property management)' },
  { key: 'medical', label: 'Medical/healthcare decisions' },
  { key: 'property', label: 'Real property transactions (buying/selling real estate)' }
];
export default function PowerOfAttorneyOutline() {
  const [principal, setPrincipal] = useState('');
  const [agent, setAgent] = useState('');
  const [powers, setPowers] = useState({ financial: true, medical: false, property: false });
  const [duration, setDuration] = useState('Until revoked');
  const [copied, setCopied] = useState(false);
  function togglePower(key) {
    setPowers((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function buildOutline() {
    const principalName = principal || '[Principal Name]';
    const agentName = agent || '[Agent/Attorney-in-Fact Name]';
    const selectedPowers = POWER_OPTIONS.filter((p) => powers[p.key]).map((p) => p.label);
    return [
      'POWER OF ATTORNEY - OUTLINE',
      '',
      `1. Principal: ${principalName} ("Principal") grants this power of attorney.`,
      '',
      `2. Agent: ${agentName} ("Agent" or "Attorney-in-Fact") is appointed to act on the Principal's behalf.`,
      '',
      '3. Powers Granted:',
      selectedPowers.length ? selectedPowers.map((p) => `   - ${p}`).join('\n') : '   - [No powers selected]',
      '',
      `4. Duration: This power of attorney is effective ${duration}.`,
      '',
      '5. Scope and Limitations: Clearly describe any limitations on the Agent\'s authority, and whether this is a general or limited/specific power of attorney.',
      '',
      '6. Durability: State whether this power of attorney remains effective if the Principal becomes incapacitated (a "durable" power of attorney), which typically requires specific language.',
      '',
      '7. Revocation: Describe how and when the Principal may revoke this power of attorney.',
      '',
      '8. Execution Requirements: Most jurisdictions require specific formalities - such as notarization and/or witnesses - for a power of attorney to be legally valid.',
      '',
      '9. Signatures: Principal signs (and, depending on jurisdiction, the Agent may also sign to accept the appointment), typically before a notary public and/or witnesses.'
    ].join('\n');
  }
  const outline = buildOutline();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outline);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Power of Attorney Outline</h1>
      <p className="tool-description">
        Fill in the basic details below to generate an educational outline of what a power of
        attorney document typically contains. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>This absolutely requires a real lawyer:</strong> A power of attorney is a powerful
        legal document that requires proper legal execution (often notarization and/or witnesses)
        to be valid, and improper use can cause serious harm. This tool is educational only and
        does NOT produce a valid, executable power of attorney. Consult a qualified lawyer before
        creating or signing any actual power of attorney.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="poa-principal">Principal name (the person granting power)</label>
          <input id="poa-principal" type="text" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="poa-agent">Agent name (the person receiving power)</label>
          <input id="poa-agent" type="text" value={agent} onChange={(e) => setAgent(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="poa-duration">Duration</label>
          <input id="poa-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Until revoked" />
        </div>
      </div>
      <div className="tool-controls">
        <strong>Powers granted:</strong>
        {POWER_OPTIONS.map((p) => (
          <label className="checkbox-label" key={p.key}>
            <input type="checkbox" checked={!!powers[p.key]} onChange={() => togglePower(p.key)} />
            {p.label}
          </label>
        ))}
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated outline</label>
        <textarea readOnly value={outline} style={{ minHeight: 320 }} />
      </div>
    </div>
  );
}
