import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("learning-roadmap", {
  role: "an expert curriculum designer creating a skill learning roadmap",
  shape: `{ "title": "string", "stages": [ { "stage": "string", "topics": ["string"], "estimatedDuration": "string" } ] }`
});
