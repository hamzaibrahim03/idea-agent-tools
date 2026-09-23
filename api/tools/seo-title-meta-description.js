import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("seo-title-meta-description", {
  role: "an expert SEO copywriter",
  shape: `{ "titles": ["string, 3 title options within 60 characters"], "metaDescriptions": ["string, 3 meta description options within 155 characters"] }`
});
