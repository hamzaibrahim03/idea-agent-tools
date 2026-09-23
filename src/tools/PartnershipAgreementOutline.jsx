import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function PartnershipAgreementOutline() {
  const [businessName, setBusinessName] = useState('');
  const [partners, setPartners] = useState([
    { name: '', profitSplit: '50' },
    { name: '', profitSplit: '50' }
  ]);
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('partnership-agreement-outline', 'Partnership Agreement Outline');
  const title = ai.result?.title || '';
  const sections = ai.result?.sections || [];
  function updatePartner(index, field, value) {
    setPartners((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }
  function addPartner() {
    setPartners((prev) => [...prev, { name: '', profitSplit: '0' }]);
  }
  function removePartner(index) {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  }
  const totalSplit = partners.reduce((sum, p) => sum + (Number(p.profitSplit) || 0), 0);
  const partnerList = partners.map((p, i) => `${p.name || `Partner ${i + 1}`} (${p.profitSplit || 0}%)`).join(', ');
  async function handleGenerate() {
    await ai.generate({ businessName, partners: partnerList });
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
      <h1>Partnership Agreement Outline</h1>
      <p className="tool-description">
        Enter partner names, your business name, and a profit-split percentage, then click "Generate
        with AI" for a genuinely AI-written, plain-language outline of standard partnership agreement
        sections tailored to your details - free, no account needed (rate-limited to keep it free for
        everyone). This is an educational outline, not a legal document - consult a lawyer to draft an
        actual partnership agreement.
      </p>
      <div className="tool-panel">
        <label htmlFor="pa-business">Business name</label>
        <input id="pa-business" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ maxWidth: '300px' }} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addPartner}>
          Add partner
        </button>
        <button type="button" onClick={handleGenerate} disabled={ai.loading}>
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
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Partner name</th>
              <th>Profit split (%)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={p.name} onChange={(e) => updatePartner(i, 'name', e.target.value)} placeholder={`Partner ${i + 1}`} style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} max={100} value={p.profitSplit} onChange={(e) => updatePartner(i, 'profitSplit', e.target.value)} style={{ width: '80px' }} />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removePartner(i)} disabled={partners.length <= 2}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Math.round(totalSplit) !== 100 && (
        <div className="tool-error">
          <strong>Note:</strong> Profit splits currently total {totalSplit}%, not 100%.
        </div>
      )}
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
