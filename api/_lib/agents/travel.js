import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("travel", {
  role: "an expert travel agent and trip planner",
  shape: `{
  "summary": "short overview of the trip plan",
  "budgetBreakdown": { "transport": number, "accommodation": number, "food": number, "activities": number, "emergencyReserve": number },
  "itinerary": [ { "day": number, "title": "string", "activities": ["string"] } ],
  "accommodationRecommendations": ["string"],
  "transportRecommendations": ["string"],
  "tips": ["string"]
}`
});
