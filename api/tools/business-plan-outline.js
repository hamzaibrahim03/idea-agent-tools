import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("business-plan-outline", {
  role: "an expert business plan consultant",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "guidingPrompts": ["string"] } ] }`
});
