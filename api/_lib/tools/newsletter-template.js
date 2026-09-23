import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("newsletter-template", {
  role: "an expert email newsletter copywriter",
  shape: `{ "subject": "string", "headline": "string", "sections": [ { "heading": "string", "content": "string" } ], "callToAction": "string" }`
});
