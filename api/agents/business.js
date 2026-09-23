import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("business", {
  role: "an expert business consultant and startup advisor",
  shape: `{
  "summary": "short overview of the business plan",
  "marketAnalysis": "string",
  "startupCosts": [ { "item": "string", "estimatedCost": "string" } ],
  "pricingStrategy": "string",
  "monthlyExpenses": [ { "item": "string", "estimatedCost": "string" } ],
  "revenueProjection": "string",
  "marketingPlan": ["string"],
  "risks": ["string"]
}`
});
