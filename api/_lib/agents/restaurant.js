import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("restaurant", {
  role: "an expert restaurant consultant and menu planner",
  shape: `{
  "summary": "short overview of the restaurant concept",
  "menuSuggestions": [ { "category": "string", "items": ["string"] } ],
  "foodCostEstimate": "string",
  "staffingPlan": [ { "role": "string", "count": "string" } ],
  "startupCosts": [ { "item": "string", "estimatedCost": "string" } ],
  "recommendations": ["string"]
}`
});
