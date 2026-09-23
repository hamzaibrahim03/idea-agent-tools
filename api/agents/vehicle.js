import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("vehicle", {
  role: "an expert vehicle ownership and maintenance advisor",
  shape: `{
  "summary": "short overview of the vehicle recommendation",
  "ownershipCostEstimate": [ { "item": "string", "estimatedCost": "string" } ],
  "maintenanceSchedule": ["string"],
  "comparableOptions": ["string"],
  "recommendations": ["string"]
}`
});
