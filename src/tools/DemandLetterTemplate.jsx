import { useState } from 'react';
export default function DemandLetterTemplate() {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amountOwed, setAmountOwed] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [copied, setCopied] = useState(false);
  function buildLetter() {
    const from = sender || '[Your Name]';
    const to = recipient || '[Recipient Name]';
    const amount = amountOwed || '[Amount Owed]';
    const issue = issueDescription || '[Description of the issue]';
    const dueDate = deadline || '[Deadline]';
    return [
      `From: ${from}`,
      `To: ${to}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      'RE: Demand for Payment / Resolution',
      '',
      `Dear ${to},`,
      '',
      `This letter serves as formal demand regarding the following matter: ${issue}`,
      '',
      amountOwed
        ? `As a result, you owe the amount of ${amount}, which remains outstanding.`
        : 'As a result, I am requesting that this matter be resolved as described above.',
      '',
      `I request that you resolve this matter by ${dueDate}. If this matter is not resolved by that date, I may pursue further action, which could include legal proceedings.`,
      '',
      'I hope to resolve this matter amicably and promptly. Please contact me at your earliest convenience to discuss.',
      '',
      'Sincerely,',
      from
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
      <h1>Demand Letter Template</h1>
      <p className="tool-description">
        Fill in the details below to generate a formatted demand letter template requesting
        payment or resolution of an issue by a deadline. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is an educational template only. Demand letters can
        have legal consequences and requirements vary by situation and jurisdiction - consult a
        qualified lawyer before sending a real demand letter.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="dl-sender">Your name</label>
          <input id="dl-sender" type="text" value={sender} onChange={(e) => setSender(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="dl-recipient">Recipient name</label>
          <input id="dl-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="dl-amount">Amount owed (optional)</label>
          <input id="dl-amount" type="text" value={amountOwed} onChange={(e) => setAmountOwed(e.target.value)} placeholder="$1,200" />
        </div>
        <div className="tool-panel">
          <label htmlFor="dl-deadline">Deadline to resolve</label>
          <input id="dl-deadline" type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="14 days from the date of this letter" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="dl-issue">Description of issue</label>
        <textarea id="dl-issue" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} style={{ minHeight: 90 }} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy letter'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated letter</label>
        <textarea readOnly value={letter} style={{ minHeight: 280 }} />
      </div>
    </div>
  );
}
