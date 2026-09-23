import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function NdaTemplateGenerator() {
  const [disclosingParty, setDisclosingParty] = useState('');
  const [receivingParty, setReceivingParty] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('2 years');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('nda', 'NDA Template Generator');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  async function handleGenerate() {
    await ai.generate({ disclosingParty, receivingParty, purpose, duration });
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
      <h1>NDA Template Generator</h1>
      <p className="tool-description">
        Fill in the basic details below and click "Generate with AI" for a genuinely AI-written,
        plain-language non-disclosure agreement outline tailored to your details - free, no account
        needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is an educational template only, not a legally
        binding document as-is. Consult a qualified lawyer before using any generated document.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="nda-disclosing">Disclosing party</label>
          <input id="nda-disclosing" type="text" value={disclosingParty} onChange={(e) => setDisclosingParty(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-receiving">Receiving party</label>
          <input id="nda-receiving" type="text" value={receivingParty} onChange={(e) => setReceivingParty(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-purpose">Purpose of disclosure</label>
          <input id="nda-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="evaluating a potential partnership" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-duration">Duration</label>
          <input id="nda-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2 years" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !disclosingParty.trim() || !receivingParty.trim()}>
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
