import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const DATA_TYPES = [
  { key: 'email', label: 'Email address' },
  { key: 'name', label: 'Name' },
  { key: 'cookies', label: 'Cookies' },
  { key: 'analytics', label: 'Analytics/usage data' },
  { key: 'payment', label: 'Payment information' }
];
export default function PrivacyPolicyGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [collected, setCollected] = useState({ email: true, name: true, cookies: true, analytics: false, payment: false });
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('privacy-policy', 'Privacy Policy Generator');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  function toggle(key) {
    setCollected((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  async function handleGenerate() {
    const selectedTypes = DATA_TYPES.filter((t) => collected[t.key]).map((t) => t.label).join(', ');
    await ai.generate({ businessName, contactEmail, dataCollected: selectedTypes });
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
      <h1>Privacy Policy Generator</h1>
      <p className="tool-description">
        Fill in your business details and select the types of data you collect, then click "Generate
        with AI" for a genuinely AI-written starter privacy policy with common sections - free, no
        account needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a starting template only. It must be reviewed
        and customized by a qualified lawyer before real use, and may not satisfy specific legal
        requirements (e.g. GDPR, CCPA) that apply to your business.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pp-name">Business name</label>
          <input id="pp-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pp-email">Contact email</label>
          <input id="pp-email" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="privacy@example.com" />
        </div>
      </div>
      <div className="tool-controls">
        <strong>Data collected:</strong>
        {DATA_TYPES.map((t) => (
          <label className="checkbox-label" key={t.key}>
            <input type="checkbox" checked={!!collected[t.key]} onChange={() => toggle(t.key)} />
            {t.label}
          </label>
        ))}
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
