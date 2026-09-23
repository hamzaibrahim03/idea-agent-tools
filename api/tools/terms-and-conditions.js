import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("terms-and-conditions", {
  role: "a professional drafting starter Terms & Conditions for a business or website (educational template, must be reviewed by a lawyer)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
