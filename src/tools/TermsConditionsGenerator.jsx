import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function TermsConditionsGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [offering, setOffering] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [accountsRequired, setAccountsRequired] = useState(true);
  const [paymentsAccepted, setPaymentsAccepted] = useState(true);
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('terms-and-conditions', 'Terms & Conditions Generator');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  async function handleGenerate() {
    await ai.generate({
      businessName,
      offering,
      contactEmail,
      accountsRequired: accountsRequired ? 'yes' : 'no',
      paymentsAccepted: paymentsAccepted ? 'yes' : 'no'
    });
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
      <h1>Terms &amp; Conditions Generator</h1>
      <p className="tool-description">
        Fill in your business details below and click "Generate with AI" for a genuinely AI-written
        starter Terms and Conditions with common sections - acceptance of terms, user
        responsibilities, limitation of liability, and more - free, no account needed (rate-limited
        to keep it free for everyone).
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a starting template only. It must be reviewed
        and customized by a qualified lawyer before real use - it is not a substitute for legal
        advice.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="tc-name">Business/website name</label>
          <input id="tc-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-offering">What you sell/offer</label>
          <input id="tc-offering" type="text" value={offering} onChange={(e) => setOffering(e.target.value)} placeholder="an online scheduling tool" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-email">Contact email</label>
          <input id="tc-email" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="support@example.com" />
        </div>
      </div>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={accountsRequired} onChange={(e) => setAccountsRequired(e.target.checked)} />
          User accounts required
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={paymentsAccepted} onChange={(e) => setPaymentsAccepted(e.target.checked)} />
          Payments accepted
        </label>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !businessName.trim()}>
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
