import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function RentalAgreementOutline() {
  const [landlord, setLandlord] = useState('');
  const [tenant, setTenant] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [termLength, setTermLength] = useState('12 months');
  const [deposit, setDeposit] = useState('');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('rental-agreement-outline', 'Rental Agreement Outline Generator');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  async function handleGenerate() {
    await ai.generate({ landlord, tenant, address, rent, termLength, deposit });
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
      <h1>Rental Agreement Outline Generator</h1>
      <p className="tool-description">
        Fill in the basic details below and click "Generate with AI" for a genuinely AI-written,
        plain-language outline of the sections a typical residential rental agreement contains,
        tailored to your details - free, no account needed (rate-limited to keep it free for
        everyone).
      </p>
      <div className="tool-error">
        <strong>Not a legal document:</strong> This is an educational outline only, not a legally
        binding rental agreement. Requirements vary by jurisdiction. Consult a qualified lawyer or
        use a proper legal document service to create an actual lease.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ra-landlord">Landlord name</label>
          <input id="ra-landlord" type="text" value={landlord} onChange={(e) => setLandlord(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-tenant">Tenant name</label>
          <input id="ra-tenant" type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="John Smith" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-address">Property address</label>
          <input id="ra-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Springfield" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-rent">Monthly rent amount</label>
          <input id="ra-rent" type="text" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="$1,500" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-term">Term length</label>
          <input id="ra-term" type="text" value={termLength} onChange={(e) => setTermLength(e.target.value)} placeholder="12 months" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-deposit">Security deposit</label>
          <input id="ra-deposit" type="text" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="$1,500" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !address.trim()}>
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
