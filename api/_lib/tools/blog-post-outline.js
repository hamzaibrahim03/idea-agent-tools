import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("blog-post-outline", {
  role: "an expert content strategist and outline writer",
  shape: `{ "title": "string", "sections": [ { "heading": "string", "wordCountAllocation": "string", "keyPoints": ["string"] } ] }`
});
