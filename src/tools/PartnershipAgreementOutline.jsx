import { useState } from 'react';
export default function PartnershipAgreementOutline() {
  const [businessName, setBusinessName] = useState('');
  const [partners, setPartners] = useState([
    { name: '', profitSplit: '50' },
    { name: '', profitSplit: '50' }
  ]);
  const [copied, setCopied] = useState(false);
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
  const sections = [
    { title: 'Ownership & Profit Split', text: `Ownership and profit distribution among partners: ${partnerList}.` },
    { title: 'Roles & Responsibilities', text: 'Define each partner\'s day-to-day duties, decision-making authority, and time commitment.' },
    { title: 'Capital Contributions', text: 'Document what each partner contributes at formation (cash, assets, equipment, or expertise).' },
    { title: 'Profit & Loss Distribution', text: `Profits and losses are shared according to the split above (${partnerList}), unless otherwise agreed in writing.` },
    { title: 'Decision-Making', text: 'Specify which decisions require unanimous consent vs. majority vote.' },
    { title: 'Dispute Resolution', text: 'Outline the process for resolving disagreements (e.g. mediation before litigation).' },
    { title: 'Exit & Buyout Terms', text: 'Describe what happens if a partner wants to leave, retire, or is bought out.' },
    { title: 'Dissolution', text: 'Define the process for winding down the business if the partnership ends.' }
  ];
  function buildText() {
    const header = `Partnership Agreement Outline${businessName ? ` - ${businessName}` : ''}`;
    const lines = [header, `Partners: ${partnerList}`, ''];
    sections.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}`);
      lines.push(`   ${s.text}`);
      lines.push('');
    });
    lines.push('This is an educational outline only, not a legal document. Consult a lawyer to draft an actual partnership agreement.');
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
      <h1>Partnership Agreement Outline</h1>
      <p className="tool-description">
        Enter partner names, your business name, and a profit-split percentage to generate a
        plain-language outline of standard partnership agreement sections filled in with your
        values. This is an educational outline, not a legal document - consult a lawyer to draft an
        actual partnership agreement. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="pa-business">Business name</label>
        <input id="pa-business" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ maxWidth: '300px' }} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addPartner}>
          Add partner
        </button>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
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
      <ul className="uuid-list">
        {sections.map((s, i) => (
          <li key={s.title} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong>
              {i + 1}. {s.title}
            </strong>
            <span style={{ opacity: 0.75, fontSize: '13px' }}>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
