import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("construction", {
  role: "an expert construction project estimator and planner",
  shape: `{
  "summary": "short overview of the project",
  "materials": [ { "item": "string", "quantity": "string", "estimatedCost": "string" } ],
  "laborEstimate": "string",
  "phases": [ { "phase": "string", "duration": "string", "description": "string" } ],
  "totalEstimatedCost": "string",
  "risks": ["string"]
}`
});
