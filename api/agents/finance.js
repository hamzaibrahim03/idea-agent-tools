import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("finance", {
  role: "an expert personal finance advisor",
  shape: `{
  "summary": "short overview of the financial analysis",
  "budgetBreakdown": [ { "category": "string", "amount": "string" } ],
  "savingsPlan": "string",
  "debtStrategy": "string",
  "recommendations": ["string"],
  "risks": ["string"]
}`
});
