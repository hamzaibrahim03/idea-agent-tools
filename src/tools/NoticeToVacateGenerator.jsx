import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function NoticeToVacateGenerator() {
  const [landlordName, setLandlordName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [address, setAddress] = useState('');
  const [vacateDate, setVacateDate] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('30 days');
  const [issuedBy, setIssuedBy] = useState('landlord');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('notice-to-vacate', 'Notice to Vacate Generator');
  const notice = ai.result?.letter || '';
  async function handleGenerate() {
    await ai.generate({ landlordName, tenantName, address, vacateDate, noticePeriod, issuedBy });
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(notice);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Notice to Vacate Generator</h1>
      <p className="tool-description">
        Fill in the details below and click "Generate with AI" for a genuinely AI-written
        notice-to-vacate letter, usable by either a landlord or a tenant - free, no account needed
        (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> Required notice periods and delivery methods vary by
        jurisdiction and lease terms. This is an educational template only - consult a qualified
        lawyer or local tenant/landlord resources before sending a real notice.
      </div>
      <div className="tool-controls">
        <label>
          Notice issued by:
          <select value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)}>
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="nv-landlord">Landlord name</label>
          <input id="nv-landlord" type="text" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-tenant">Tenant name</label>
          <input id="nv-tenant" type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-address">Property address</label>
          <input id="nv-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-date">Vacate date</label>
          <input id="nv-date" type="text" value={vacateDate} onChange={(e) => setVacateDate(e.target.value)} placeholder="October 31, 2026" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-notice">Notice period</label>
          <input id="nv-notice" type="text" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} placeholder="30 days" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !address.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={handleCopy} disabled={!notice}>
          {copied ? 'Copied!' : 'Copy notice'}
        </button>
        <button type="button" onClick={() => window.print()} disabled={!notice}>
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
        <label>Generated notice</label>
        <textarea readOnly value={notice} placeholder="Fill in the details above and click Generate with AI" style={{ minHeight: 280 }} />
      </div>
    </div>
  );
}
