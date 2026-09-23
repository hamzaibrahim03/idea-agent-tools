import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("video-script-outline", {
  role: "an expert video scriptwriter",
  shape: `{ "title": "string", "scenes": [ { "sceneNumber": number, "timeAllocation": "string", "visualNotes": "string", "script": "string" } ] }`
});
