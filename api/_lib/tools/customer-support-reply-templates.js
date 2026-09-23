import { createComputeHandler } from '../computeHandler.js';

const SCENARIOS = {
  refund: 'Refund request',
  shipping_delay: 'Shipping delay',
  product_defect: 'Product defect',
  general: 'General inquiry'
};

function buildReply({ scenario, customerName, orderNumber, issue }) {
  const name = (customerName || '').trim() || 'there';
  const order = (orderNumber || '').trim() || '[order number]';
  const detail = (issue || '').trim() || '[describe the specific issue]';
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

function compute({ scenario, customerName, orderNumber, issue }) {
  const output = buildReply({ scenario, customerName, orderNumber, issue });
  return { output };
}

export default createComputeHandler(compute);
