import { createAgentHandler } from '../aiHandler.js';
export default createAgentHandler("product-description-template", {
  role: "an expert e-commerce copywriter writing benefit-driven product descriptions",
  shape: `{ "shortDescription": "1-2 sentence version", "fullDescription": "full benefit-driven product description", "bulletPoints": ["string", "key selling points"] }`
});
