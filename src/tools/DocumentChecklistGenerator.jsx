import { useState } from 'react';
const DOCUMENT_TYPES = {
  report: {
    label: 'Report',
    items: [
      'Title page', 'Executive summary', 'Table of contents', 'Introduction / background',
      'Methodology (if applicable)', 'Findings / body sections', 'Data / charts / appendices',
      'Conclusion', 'Recommendations', 'References / sources'
    ]
  },
  contract: {
    label: 'Contract',
    items: [
      'Parties involved and definitions', 'Effective date and term', 'Scope of work / obligations',
      'Payment terms', 'Confidentiality clause', 'Termination conditions',
      'Liability and indemnification', 'Dispute resolution / governing law',
      'Signatures block', 'Exhibits / attachments'
    ]
  },
  resume: {
    label: 'Resume',
    items: [
      'Contact information', 'Professional summary', 'Work experience (reverse chronological)',
      'Education', 'Skills section', 'Certifications (if relevant)',
      'Quantified achievements', 'Consistent formatting and tense', 'No spelling/grammar errors',
      'Tailored to the target role'
    ]
  },
  proposal: {
    label: 'Proposal',
    items: [
      'Cover page / title', 'Executive summary', 'Problem statement / client need',
      'Proposed solution', 'Timeline / milestones', 'Pricing / budget breakdown',
      'Team / qualifications', 'Terms and conditions', 'Call to action', 'Contact information'
    ]
  }
};
export default function DocumentChecklistGenerator() {
  const [docType, setDocType] = useState('report');
  const [checked, setChecked] = useState({});
  const items = DOCUMENT_TYPES[docType].items;
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Document Checklist Generator</h1>
      <p className="tool-description">
        Pick a document type to get a curated checklist of standard sections and elements that
        document type should typically include, from a built-in reference list. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Document type:
          <select value={docType} onChange={(e) => setDocType(e.target.value)}>
            {Object.entries(DOCUMENT_TYPES).map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>
          {DOCUMENT_TYPES[docType].label} checklist ({checkedCount}/{items.length} done)
        </label>
        {items.map((item) => (
          <label key={item} className="checkbox-label" style={{ padding: '4px 0' }}>
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
            <span style={{ textDecoration: checked[item] ? 'line-through' : 'none', opacity: checked[item] ? 0.5 : 1 }}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
