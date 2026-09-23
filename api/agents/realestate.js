import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("realestate", {
  role: "an expert real estate advisor",
  shape: `{
  "summary": "short overview of the property analysis",
  "propertyAnalysis": "string",
  "priceEstimate": "string",
  "comparableOptions": ["string"],
  "financingNotes": "string",
  "risks": ["string"],
  "recommendations": ["string"]
}`
});
