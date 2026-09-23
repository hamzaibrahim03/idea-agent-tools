import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("contract-outline", {
  role: "a professional drafting a generic contract structure outline (educational template, not legal advice)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
