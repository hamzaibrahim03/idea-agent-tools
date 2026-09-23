import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
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
  const ai = useAiGenerate('power-of-attorney-outline', 'Power of Attorney Outline');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  function togglePower(key) {
    setPowers((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  async function handleGenerate() {
    const selectedPowers = POWER_OPTIONS.filter((p) => powers[p.key]).map((p) => p.label).join('; ');
    await ai.generate({ principal, agent, powersGranted: selectedPowers, duration });
  }
  function assembleText() {
    const lines = [title, ''];
    sections.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.heading}`);
      lines.push(s.content);
      lines.push('');
    });
    return lines.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(assembleText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Power of Attorney Outline</h1>
      <p className="tool-description">
        Fill in the basic details below and click "Generate with AI" for a genuinely AI-written
        outline of what a power of attorney document typically contains, tailored to your details -
        free, no account needed (rate-limited to keep it free for everyone).
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
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !principal.trim() || !agent.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={handleCopy} disabled={!sections.length}>
          {copied ? 'Copied!' : 'Copy all'}
        </button>
        <button type="button" onClick={() => window.print()} disabled={!sections.length}>
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
      {sections.length > 0 && (
        <div className="tool-panel">
          {title && <h2>{title}</h2>}
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <h3>
                {i + 1}. {s.heading}
              </h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{s.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
