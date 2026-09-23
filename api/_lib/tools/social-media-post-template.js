import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("social-media-post-template", {
  role: "an expert social media copywriter",
  shape: `{ "posts": [ { "platform": "string", "text": "string, respecting that platform's typical character limits", "hashtags": ["string"] } ] }`
});
