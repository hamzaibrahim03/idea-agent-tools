import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("sop-template", {
  role: "an expert operations manager writing Standard Operating Procedures",
  shape: `{ "title": "string", "purpose": "string", "steps": [ { "stepNumber": number, "instruction": "string" } ] }`
});
