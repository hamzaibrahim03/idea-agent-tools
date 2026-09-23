import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("hashtags", {
  role: "an expert social media strategist generating relevant hashtag sets",
  shape: `{ "hashtags": ["string, 15-20 relevant hashtags mixing broad and niche tags"], "notes": "brief usage tip" }`
});
