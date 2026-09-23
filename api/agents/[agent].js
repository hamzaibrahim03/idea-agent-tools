import h_business from '../_lib/agents/business.js';
import h_construction from '../_lib/agents/construction.js';
import h_developer from '../_lib/agents/developer.js';
import h_education from '../_lib/agents/education.js';
import h_energy from '../_lib/agents/energy.js';
import h_finance from '../_lib/agents/finance.js';
import h_marketing from '../_lib/agents/marketing.js';
import h_realestate from '../_lib/agents/realestate.js';
import h_restaurant from '../_lib/agents/restaurant.js';
import h_travel from '../_lib/agents/travel.js';
import h_vehicle from '../_lib/agents/vehicle.js';

const registry = {
  "business": h_business,
  "construction": h_construction,
  "developer": h_developer,
  "education": h_education,
  "energy": h_energy,
  "finance": h_finance,
  "marketing": h_marketing,
  "realestate": h_realestate,
  "restaurant": h_restaurant,
  "travel": h_travel,
  "vehicle": h_vehicle,
};

export default async function handler(req, res) {
  const { agent } = req.query || {};
  const toolHandler = registry[agent];
  if (!toolHandler) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  return toolHandler(req, res);
}
