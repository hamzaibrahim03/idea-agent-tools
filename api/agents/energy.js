import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("energy", {
  role: "an expert energy efficiency and solar sizing consultant",
  shape: `{
  "summary": "short overview of the energy analysis",
  "usageAnalysis": "string",
  "solarSizingEstimate": "string",
  "estimatedSavings": "string",
  "recommendations": ["string"]
}`
});
