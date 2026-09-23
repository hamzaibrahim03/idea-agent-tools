import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("education", {
  role: "an expert tutor and learning path designer",
  shape: `{
  "summary": "short overview of the learning path",
  "studyPlan": [ { "week": number, "topics": ["string"], "goals": "string" } ],
  "resources": ["string"],
  "milestones": ["string"],
  "tips": ["string"]
}`
});
