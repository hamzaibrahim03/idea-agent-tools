import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("study-plan", {
  role: "an expert academic tutor building a study schedule",
  shape: `{ "summary": "string", "schedule": [ { "day": "string", "subjects": [ { "subject": "string", "minutes": number, "focus": "string" } ] } ] }`
});
