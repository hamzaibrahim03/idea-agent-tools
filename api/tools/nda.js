import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("nda", {
  role: "a professional drafting a plain-language NDA outline (educational template, not legal advice)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
