import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const SCENARIOS = {
  refund: 'Refund request',
  shipping_delay: 'Shipping delay',
  product_defect: 'Product defect',
  general: 'General inquiry'
};
function buildReply({ scenario, customerName, orderNumber, issue }) {
  const name = customerName.trim() || 'there';
  const order = orderNumber.trim() || '[order number]';
  const detail = issue.trim() || '[describe the specific issue]';
  switch (scenario) {
    case SCENARIOS.refund:
      return `Hi ${name},\n\nThank you for reaching out about order ${order}. I'm sorry to hear it didn't work out - I've started processing your refund now.\n\nDetails: ${detail}\n\nYou should see the refund reflected in 3-5 business days. Let us know if there's anything else we can help with.\n\nBest,\n[Your name]`;
    case SCENARIOS.shipping_delay:
      return `Hi ${name},\n\nThanks for your patience regarding order ${order}. I understand the delay is frustrating, and I want to give you an update.\n\nDetails: ${detail}\n\nWe're actively tracking this and will notify you as soon as it ships. Please let us know if you have any questions in the meantime.\n\nBest,\n[Your name]`;
    case SCENARIOS.product_defect:
      return `Hi ${name},\n\nI'm sorry to hear about the issue with order ${order} - that's not the experience we want for you.\n\nDetails: ${detail}\n\nWe'll send a replacement right away at no extra cost. If you could send a photo of the defect when convenient, that helps us improve. Thank you for letting us know.\n\nBest,\n[Your name]`;
    case SCENARIOS.general:
    default:
      return `Hi ${name},\n\nThanks for reaching out about order ${order}.\n\nDetails: ${detail}\n\nHere's what I can share: [add your answer here]. Let us know if you need anything else.\n\nBest,\n[Your name]`;
  }
}
export default function CustomerSupportReplyTemplates() {
  const [scenario, setScenario] = useState(SCENARIOS.refund);
  const [customerName, setCustomerName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [copied, setCopied] = useState(false);
  const output = useMemo(
    () => buildReply({ scenario, customerName, orderNumber, issue }),
    [scenario, customerName, orderNumber, issue]
  );
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'support-reply.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Customer Support Reply Templates</h1>
      <p className="tool-description">
        Pick a scenario and fill in the customer name, order number, and specific issue to fill a
        template reply. This is a template generator, not AI-written support content - review and
        personalize before sending. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Scenario:
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {Object.values(SCENARIOS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy reply'}</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cs-name">Customer name</label>
          <input id="cs-name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Alex" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cs-order">Order number</label>
          <input id="cs-order" type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. #10234" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="cs-issue">Specific issue</label>
        <input id="cs-issue" type="text" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. item arrived with a cracked case" />
      </div>
      <div className="tool-panel">
        <label htmlFor="cs-output">Generated reply</label>
        <textarea id="cs-output" value={output} readOnly style={{ minHeight: 220 }} />
      </div>
    </div>
  );
}
