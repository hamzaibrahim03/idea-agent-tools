import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("partnership-agreement-outline", {
  role: "a professional drafting a plain-language partnership agreement outline (educational template, not legal advice)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
