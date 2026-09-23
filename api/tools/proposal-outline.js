import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("proposal-outline", {
  role: "an expert business proposal writer",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "content": "string" } ] }`
});
