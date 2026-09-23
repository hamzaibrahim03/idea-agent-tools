import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("property-description-template", {
  role: "an expert real estate copywriter writing property listing descriptions",
  shape: `{ "headline": "string", "fullDescription": "full listing description", "highlights": ["string", "key selling points"] }`
});
