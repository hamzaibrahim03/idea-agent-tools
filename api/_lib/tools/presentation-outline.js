import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("presentation-outline", {
  role: "an expert presentation coach and slide outline writer",
  shape: `{ "title": "string", "slides": [ { "slideNumber": number, "heading": "string", "content": ["string"] } ] }`
});
