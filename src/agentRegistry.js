import ConstructionAgent from './agents/ConstructionAgent.jsx';
import BusinessAgent from './agents/BusinessAgent.jsx';
import DeveloperAgent from './agents/DeveloperAgent.jsx';
import TravelAgent from './agents/TravelAgent.jsx';
export const AGENTS = [
  {
    slug: 'construction-agent',
    icon: '🏗️',
    category: 'construction',
    name: 'Construction Agent',
    description: 'Plan a house build end-to-end: materials, BOQ, cost, timeline, labor, and risk - all in one guided flow.',
    seoDescription:
      'Free construction planning agent. Enter your house size, location tier, and budget to get materials, a bill of quantities, cost estimate, timeline, labor plan, and risk assessment in one flow.',
    component: ConstructionAgent
  },
  {
    slug: 'business-agent',
    icon: '💼',
    category: 'business',
    name: 'Business Agent',
    description: 'Plan a new business end-to-end: startup costs, pricing, profit projection, and a marketing plan - all in one guided flow.',
    seoDescription:
      'Free business planning agent. Enter your business idea and starting capital to get a cost breakdown, pricing recommendation, profit projection, and marketing plan in one flow.',
    component: BusinessAgent
  },
  {
    slug: 'developer-agent',
    icon: '💻',
    category: 'dev',
    name: 'Developer Agent',
    description: 'Plan a software project end-to-end: requirements, component/API structure, database schema starter, and a testing/deployment checklist - all in one guided flow.',
    seoDescription:
      'Free software project planning agent. Describe your app to get a structured requirements breakdown, component and API outline, a starter database schema, and a testing/deployment checklist in one flow.',
    component: DeveloperAgent
  },
  {
    slug: 'travel-agent',
    icon: '✈️',
    category: 'travel',
    name: 'Travel Agent',
    description: 'Plan a trip end-to-end: transport, hotel budget, day-by-day itinerary, food, activities, and an emergency reserve - all in one guided flow.',
    seoDescription:
      'Free trip planning agent. Enter your destination, group size, trip length, and budget to get a transport/hotel/food/activity budget split, a day-by-day itinerary skeleton, and an emergency reserve recommendation.',
    component: TravelAgent
  }
];
export function getAgentBySlug(slug) {
  return AGENTS.find((a) => a.slug === slug);
}
