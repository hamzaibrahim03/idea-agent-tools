import { useState } from 'react';
const SCENARIOS = {
  'Starting a business': [
    'Choose and register a business structure (LLC, corporation, partnership, sole proprietorship)',
    'Obtain an Employer Identification Number (EIN) or local tax ID',
    'Register the business name / DBA if applicable',
    'Draft an operating agreement or partnership/shareholder agreement',
    'Obtain necessary business licenses and permits',
    'Set up a registered agent (if required in your jurisdiction)',
    'Draft standard contracts/terms for customers or clients',
    'Consider trademark registration for your business name/logo',
    'Set up business insurance (general liability, professional liability, etc.)',
    'Consult an accountant about tax obligations'
  ],
  'Signing a lease': [
    'Read the full lease agreement, including all addenda',
    'Confirm the rent amount, due date, and accepted payment methods',
    'Confirm the security deposit amount and refund conditions',
    'Understand maintenance and repair responsibilities',
    'Check policies on subletting, pets, and alterations',
    'Confirm move-in/move-out condition documentation process',
    'Understand notice requirements for renewal or termination',
    'Check for any additional fees (parking, utilities, HOA, etc.)',
    'Keep a signed copy of the lease and any addenda',
    'Document the property\'s condition with photos before move-in'
  ],
  'Hiring an employee': [
    'Verify the candidate\'s right to work (identity/work authorization documents)',
    'Prepare a written offer letter and/or employment contract',
    'Register as an employer with relevant tax authorities',
    'Set up payroll and required tax withholdings',
    'Provide any legally required new-hire notices or disclosures',
    'Prepare an employee handbook or key policies (if not already in place)',
    'Set up workers\' compensation insurance (where required)',
    'Confirm compliance with minimum wage and overtime laws',
    'Establish a personnel file for recordkeeping',
    'Understand at-will employment or termination rules in your jurisdiction'
  ],
  'Buying a home': [
    'Get pre-approved for a mortgage',
    'Hire a real estate agent (optional but common)',
    'Make an offer and sign a purchase agreement',
    'Schedule a professional home inspection',
    'Order a title search and obtain title insurance',
    'Review the mortgage loan estimate and closing disclosure',
    'Arrange homeowner\'s insurance before closing',
    'Conduct a final walkthrough before closing',
    'Review and sign closing documents (deed, mortgage note, etc.)',
    'Confirm recording of the deed with the local land records office'
  ]
};
export default function LegalDocumentChecklistGenerator() {
  const [scenario, setScenario] = useState('Starting a business');
  const [checked, setChecked] = useState({});
  function toggle(item) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }
  const items = SCENARIOS[scenario];
  const checkedCount = items.filter((item) => checked[item]).length;
  return (
    <div className="tool-page">
      <h1>Legal Document Checklist Generator</h1>
      <p className="tool-description">
        Pick a common life/business scenario to see a curated reference checklist of
        commonly-needed legal documents and steps. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a general reference checklist, not personalized
        legal advice. Requirements vary significantly by jurisdiction and individual
        circumstances - consult a qualified lawyer for guidance specific to your situation.
      </div>
      <div className="tool-controls">
        <label>
          Scenario:
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {Object.keys(SCENARIOS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <strong>
          Progress: {checkedCount} / {items.length}
        </strong>
      </div>
      <div className="tool-panel">
        <label>{scenario}</label>
        {items.map((item) => (
          <label className="checkbox-label" key={item}>
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
