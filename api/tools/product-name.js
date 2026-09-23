import { createAgentHandler } from '../_lib/aiHandler.js';
export default createAgentHandler("product-name", {
  role: "an expert brand naming consultant for products",
  shape: `{ "names": ["string, 10-12 creative and varied product name ideas"], "notes": "brief note on naming direction" }`
});
