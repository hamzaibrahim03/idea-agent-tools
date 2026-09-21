import { useState } from 'react';
export default function CoverLetterGenerator() {
  const [yourName, setYourName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [skills, setSkills] = useState('');
  const [achievement, setAchievement] = useState('');
  const [whyCompany, setWhyCompany] = useState('');
  const [copied, setCopied] = useState(false);
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  function buildLetter() {
    const greeting = hiringManager ? `Dear ${hiringManager},` : 'Dear Hiring Manager,';
    const skillsSentence = skillList.length
      ? `I bring strong experience in ${skillList.join(', ')}, which I believe aligns well with what you're looking for in this role.`
      : '';
    const achievementSentence = achievement ? `In my previous work, ${achievement}` : '';
    const whySentence = whyCompany ? `I'm particularly drawn to ${company || 'your company'} because ${whyCompany}` : '';
    return [
      greeting,
      '',
      `I am writing to express my interest in the ${jobTitle || '[Job Title]'} position at ${company || '[Company]'}. ${skillsSentence}`,
      '',
      achievementSentence,
      '',
      whySentence,
      '',
      `I would welcome the opportunity to discuss how my background can contribute to your team. Thank you for your time and consideration.`,
      '',
      'Sincerely,',
      yourName || '[Your Name]'
    ]
      .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
      .join('\n')
      .trim();
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
      <h1>Cover Letter Generator</h1>
      <p className="tool-description">
        Fill in the fields below and this tool assembles a structured cover letter from a
        fill-in-the-blank template. It is not AI-written prose - it's a mechanical template you
        should personalize further before sending. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cl-name">Your name</label>
          <input id="cl-name" type="text" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="Jordan Smith" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cl-manager">Hiring manager's name (optional)</label>
          <input id="cl-manager" type="text" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="Alex Rivera" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cl-title">Job title</label>
          <input id="cl-title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Product Manager" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cl-company">Company</label>
          <input id="cl-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="cl-skills">Key skills (comma-separated)</label>
        <input id="cl-skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="project management, data analysis, stakeholder communication" />
      </div>
      <div className="tool-panel">
        <label htmlFor="cl-achievement">A key achievement (completes "In my previous work, ...")</label>
        <textarea
          id="cl-achievement"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          placeholder="I led a cross-functional team that shipped a new feature ahead of schedule, increasing user engagement by 20%."
          style={{ minHeight: 70 }}
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="cl-why">Why this company (completes "I'm particularly drawn to ... because ...")</label>
        <textarea
          id="cl-why"
          value={whyCompany}
          onChange={(e) => setWhyCompany(e.target.value)}
          placeholder="your focus on sustainable technology matches my own career goals."
          style={{ minHeight: 70 }}
        />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy letter'}
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated letter</label>
        <textarea readOnly value={letter} style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}
