import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("customer-persona", {
  role: "an expert market researcher building customer personas",
  shape: `{ "name": "a realistic representative name", "summary": "string", "demographics": "string", "goals": ["string"], "painPoints": ["string"], "preferredChannels": ["string"] }`
});
