import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("privacy-policy", {
  role: "a professional drafting a starter privacy policy based on the data practices described (educational template, must be reviewed by a lawyer)",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
