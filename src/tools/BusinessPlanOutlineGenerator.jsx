import { useState } from 'react';
const SECTIONS = [
  { title: 'Executive Summary', prompt: 'A one-page snapshot: what the business does, who it serves, and why it will succeed.' },
  { title: 'Company Description', prompt: "The business's legal structure, mission, location, and history so far." },
  { title: 'Market Analysis', prompt: 'Target market size, customer segments, and key competitors.' },
  { title: 'Organization & Management', prompt: 'Ownership structure and the background of the founding/leadership team.' },
  { title: 'Products or Services', prompt: 'What is being sold, the problem it solves, and any competitive advantage.' },
  { title: 'Marketing & Sales Strategy', prompt: 'How customers will be reached, converted, and retained.' },
  { title: 'Funding Request', prompt: 'How much funding is needed (if any), and how it will be used.' },
  { title: 'Financial Projections', prompt: 'Revenue, expense, and profit forecasts for the next 1-3 years.' },
  { title: 'Appendix', prompt: 'Supporting documents: resumes, permits, contracts, product diagrams.' }
];
export default function BusinessPlanOutlineGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [copied, setCopied] = useState(false);
  function buildText() {
    const header = `Business Plan Outline${businessName ? ` - ${businessName}` : ''}${businessType ? ` (${businessType})` : ''}`;
    const lines = [header, ''];
    SECTIONS.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}`);
      lines.push(`   ${s.prompt}`);
      lines.push('');
    });
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
      <h1>Business Plan Outline Generator</h1>
      <p className="tool-description">
        A structured business plan template with the standard sections investors and lenders expect
        (executive summary, market analysis, financial projections, and more), each with guiding
        prompt text to help you fill it in. This is a fixed structural template, not an
        AI-generated plan. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="bp-name">Business name</label>
          <input id="bp-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Riverside Coffee Co." />
        </div>
        <div className="tool-panel">
          <label htmlFor="bp-type">Business type / industry</label>
          <input id="bp-type" type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Cafe, SaaS, Consulting" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
      <ul className="uuid-list">
        {SECTIONS.map((s, i) => (
          <li key={s.title} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong>
              {i + 1}. {s.title}
              {businessName && i === 0 ? ` — ${businessName}` : ''}
            </strong>
            <span style={{ opacity: 0.75, fontSize: '13px' }}>{s.prompt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
