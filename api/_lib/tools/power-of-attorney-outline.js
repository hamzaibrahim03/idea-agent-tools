import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("power-of-attorney-outline", {
  role: "a professional drafting a power of attorney outline (educational template, requires proper legal execution)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
