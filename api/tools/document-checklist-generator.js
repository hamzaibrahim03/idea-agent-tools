import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ docType }) {
  const type = DOCUMENT_TYPES[docType] ? docType : 'report';
  const entry = DOCUMENT_TYPES[type];
  return { label: entry.label, items: entry.items };
}

export default createComputeHandler(compute);
