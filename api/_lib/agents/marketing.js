import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("marketing", {
  role: "an expert marketing strategist",
  shape: `{
  "summary": "short overview of the marketing strategy",
  "targetAudienceProfile": "string",
  "channels": [ { "channel": "string", "strategy": "string", "budgetAllocation": "string" } ],
  "contentIdeas": ["string"],
  "campaignTimeline": [ { "phase": "string", "description": "string" } ],
  "kpis": ["string"]
}`
});
