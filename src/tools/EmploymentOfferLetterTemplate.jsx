import { useState } from 'react';
export default function EmploymentOfferLetterTemplate() {
  const [candidateName, setCandidateName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [managerName, setManagerName] = useState('');
  const [copied, setCopied] = useState(false);
  function buildLetter() {
    const candidate = candidateName || '[Candidate Name]';
    const company = companyName || '[Company Name]';
    const role = position || '[Position Title]';
    const pay = salary || '[Salary]';
    const start = startDate || '[Start Date]';
    const manager = managerName || '[Hiring Manager Name]';
    return [
      `Dear ${candidate},`,
      '',
      `We are pleased to offer you the position of ${role} at ${company}, on a ${employmentType.toLowerCase()} basis.`,
      '',
      `Start date: ${start}`,
      `Compensation: ${pay}`,
      `Employment type: ${employmentType}`,
      '',
      'This offer is subject to any pre-employment requirements described separately (such as background checks or reference checks, if applicable), and to the terms of our standard employment agreement and company policies.',
      '',
      'Your role, responsibilities, benefits, and any additional terms will be detailed further in your employment agreement and onboarding materials.',
      '',
      `Please confirm your acceptance of this offer by signing and returning a copy of this letter by [response deadline].`,
      '',
      'We are excited about the possibility of you joining our team and look forward to your response.',
      '',
      'Sincerely,',
      manager,
      company
    ].join('\n');
  }
  const letter = buildLetter();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Employment Offer Letter Template</h1>
      <p className="tool-description">
        Fill in the details below to generate a formatted employment offer letter template with
        position, salary, start date, and employment type. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a starting template only. Employment law
        requirements vary by jurisdiction - have your HR team and/or a qualified lawyer review any
        offer letter before sending it to a candidate.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ol-candidate">Candidate name</label>
          <input id="ol-candidate" type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-company">Company name</label>
          <input id="ol-company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-position">Position title</label>
          <input id="ol-position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-salary">Salary</label>
          <input id="ol-salary" type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$75,000/year" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-start">Start date</label>
          <input id="ol-start" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="October 1, 2026" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-type">Employment type</label>
          <select id="ol-type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Temporary</option>
            <option>Internship</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="ol-manager">Hiring manager name</label>
          <input id="ol-manager" type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy letter'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated offer letter</label>
        <textarea readOnly value={letter} style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}
