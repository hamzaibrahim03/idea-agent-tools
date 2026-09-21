import { useState } from 'react';
const TEMPLATES = {
  'follow-up': {
    label: 'Follow-up',
    subject: (topic) => `Following up: ${topic}`,
    body: (recipient, topic, sender) =>
      `Hi ${recipient},\n\nI wanted to follow up regarding ${topic}. Just checking in to see if you had any thoughts or questions on this.\n\nLooking forward to hearing from you.\n\nBest regards,\n${sender}`
  },
  'meeting-request': {
    label: 'Meeting Request',
    subject: (topic) => `Meeting request: ${topic}`,
    body: (recipient, topic, sender) =>
      `Hi ${recipient},\n\nI'd like to schedule some time to discuss ${topic}. Would you be available for a call this week? Let me know a few times that work for you.\n\nThanks,\n${sender}`
  },
  introduction: {
    label: 'Introduction',
    subject: (topic) => `Introduction: ${topic}`,
    body: (recipient, topic, sender) =>
      `Hi ${recipient},\n\nMy name is ${sender}, and I'm reaching out regarding ${topic}. I'd love to connect and explore how we might work together.\n\nBest,\n${sender}`
  },
  'thank-you': {
    label: 'Thank You',
    subject: (topic) => `Thank you: ${topic}`,
    body: (recipient, topic, sender) =>
      `Hi ${recipient},\n\nThank you for ${topic}. I really appreciate your time and support.\n\nBest regards,\n${sender}`
  },
  apology: {
    label: 'Apology',
    subject: (topic) => `Regarding ${topic}`,
    body: (recipient, topic, sender) =>
      `Hi ${recipient},\n\nI want to apologize for ${topic}. This wasn't the experience we intended, and I'm looking into it to make sure it's resolved.\n\nThank you for your patience.\n\nBest,\n${sender}`
  }
};
export default function BusinessEmailTemplateGenerator() {
  const [type, setType] = useState('follow-up');
  const [recipient, setRecipient] = useState('');
  const [topic, setTopic] = useState('');
  const [sender, setSender] = useState('');
  const [copied, setCopied] = useState(false);
  const template = TEMPLATES[type];
  const recipientFilled = recipient || '[Recipient Name]';
  const topicFilled = topic || '[topic]';
  const senderFilled = sender || '[Your Name]';
  const subject = template.subject(topicFilled);
  const body = template.body(recipientFilled, topicFilled, senderFilled);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Business Email Template Generator</h1>
      <p className="tool-description">
        Pick an email type and fill in the recipient, topic, and your name to produce a
        professional email draft. This fills in a fixed, fill-in-the-blank template - it is not
        AI-written, so review and personalize the result before sending. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Email type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="email-recipient">Recipient name</label>
          <input id="email-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah" />
        </div>
        <div className="tool-panel">
          <label htmlFor="email-sender">Your name</label>
          <input id="email-sender" type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g. Alex" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="email-topic">Topic / subject matter</label>
        <input id="email-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. the proposal we discussed" />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy email'}
        </button>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Subject:</strong> {subject}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{body}</div>
      </div>
    </div>
  );
}
