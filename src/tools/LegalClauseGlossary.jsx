import { useState } from 'react';
const CLAUSES = [
  {
    term: 'Indemnification',
    desc: 'A promise by one party to compensate the other for certain losses, damages, or legal claims arising from specified events - e.g. one party agreeing to cover the other\'s legal costs if a third party sues over the first party\'s actions.'
  },
  {
    term: 'Force Majeure',
    desc: 'Excuses a party from performing their obligations when extraordinary events outside their control - natural disasters, war, pandemics - make performance impossible or impractical.'
  },
  {
    term: 'Non-Compete',
    desc: 'Restricts one party (often an employee or seller of a business) from engaging in competing activities, usually for a defined time period and geographic area, after the relationship ends.'
  },
  {
    term: 'Non-Disclosure / Confidentiality',
    desc: 'Requires a party to keep certain information secret and not share it with others, typically for a defined period, with exceptions for information that becomes public independently.'
  },
  {
    term: 'Severability',
    desc: 'States that if one clause of the contract is found invalid or unenforceable, the rest of the contract remains in effect rather than the whole agreement being voided.'
  },
  {
    term: 'Arbitration',
    desc: 'Requires disputes to be resolved through a private arbitrator rather than in court, often faster and more confidential than litigation, but typically limiting the right to appeal.'
  },
  {
    term: 'Governing Law',
    desc: 'Specifies which jurisdiction\'s laws will be used to interpret and enforce the contract, regardless of where the parties are located.'
  },
  {
    term: 'Limitation of Liability',
    desc: 'Caps the amount of damages one party can recover from the other, or excludes certain types of damages (like indirect or consequential losses) entirely.'
  },
  {
    term: 'Termination Clause',
    desc: 'Defines the conditions under which either party can end the contract early, including required notice periods and any penalties.'
  },
  {
    term: 'Assignment',
    desc: 'Governs whether and how a party can transfer their rights or obligations under the contract to another party, often requiring the other party\'s consent.'
  },
  {
    term: 'Warranty',
    desc: 'A promise or guarantee about the quality, condition, or performance of goods, services, or facts stated in the contract.'
  },
  {
    term: 'Entire Agreement (Integration Clause)',
    desc: 'States that the written contract represents the complete agreement between the parties, superseding any prior verbal or written discussions.'
  },
  {
    term: 'Liquidated Damages',
    desc: 'Pre-agreed amount of compensation one party must pay the other if they breach the contract, set in advance rather than calculated after the fact.'
  },
  {
    term: 'Waiver',
    desc: 'A provision stating that failing to enforce a right under the contract on one occasion does not mean that right is given up for future occasions.'
  },
  {
    term: 'Notice Clause',
    desc: 'Specifies how formal communications between the parties (like termination notices) must be delivered - e.g. in writing, by certified mail, or email - and to what address.'
  }
];
export default function LegalClauseGlossary() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = CLAUSES.filter((c) => !q || c.term.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  return (
    <div className="tool-page">
      <h1>Legal Clause Glossary</h1>
      <p className="tool-description">
        A searchable reference glossary explaining common contract clause types in plain English.
        This is a general reference tool - it does not analyze any contract you upload or paste in.
        Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> These are general, simplified explanations for
        educational purposes only. Clause meaning and enforceability can vary by jurisdiction and
        specific wording - consult a qualified lawyer for advice on any actual contract.
      </div>
      <div className="tool-panel">
        <label htmlFor="clause-search">Search</label>
        <input
          id="clause-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. arbitration, liability, non-compete"
        />
      </div>
      {filtered.length === 0 && <p className="tool-placeholder">No matching clause types for "{query}".</p>}
      {filtered.map((c) => (
        <div className="tool-panel" key={c.term}>
          <label>{c.term}</label>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.85 }}>{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
