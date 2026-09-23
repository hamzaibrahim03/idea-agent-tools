import AIAgent from './agents/AIAgent.jsx';
export const AGENTS = [
  {
    slug: 'construction-agent',
    icon: '🏗️',
    category: 'construction',
    name: 'Construction Agent',
    description: 'AI-generated construction plan: material quantities, labor estimates, project phases, and cost estimates.',
    seoDescription:
      'Free AI construction planning agent. Describe your project to get AI-generated material quantities, labor estimates, project phases, and a cost estimate.',
    agentKey: 'construction',
    component: AIAgent
  },
  {
    slug: 'business-agent',
    icon: '💼',
    category: 'business',
    name: 'Business Agent',
    description: 'AI-generated business plan: business ideas, market analysis, startup requirements, and pricing strategy.',
    seoDescription:
      'Free AI business planning agent. Describe your business idea to get AI-generated market analysis, startup requirements, and pricing strategy.',
    agentKey: 'business',
    component: AIAgent
  },
  {
    slug: 'travel-agent',
    icon: '✈️',
    category: 'travel',
    name: 'Travel Agent',
    description: 'AI-generated trip plan: destinations, itinerary, activities, transport, and accommodation.',
    seoDescription:
      'Free AI trip planning agent. Enter your destination and dates to get an AI-generated itinerary, budget split, and accommodation/transport recommendations.',
    agentKey: 'travel',
    component: AIAgent
  },
  {
    slug: 'developer-agent',
    icon: '💻',
    category: 'dev',
    name: 'Developer Agent',
    description: 'AI-generated software plan: architecture, components, database, APIs, and code structure.',
    seoDescription:
      'Free AI software project planning agent. Describe your app to get an AI-generated architecture, database schema, API plan, and testing/deployment checklist.',
    agentKey: 'developer',
    component: AIAgent
  },
  {
    slug: 'marketing-agent',
    icon: '📣',
    category: 'marketing',
    name: 'Marketing Agent',
    description: 'AI-generated marketing plan: strategy, channels, campaigns, and content ideas.',
    seoDescription:
      'Free AI marketing planning agent. Describe your product to get an AI-generated marketing strategy, channel plan, and campaign ideas.',
    agentKey: 'marketing',
    component: AIAgent
  },
  {
    slug: 'realestate-agent',
    icon: '🏠',
    category: 'realestate',
    name: 'Real Estate Agent',
    description: 'AI-generated property analysis: requirements, price estimate, and comparisons.',
    seoDescription:
      'Free AI real estate agent. Describe the property you want to buy, rent, or invest in to get an AI-generated analysis, price estimate, and comparable options.',
    agentKey: 'realestate',
    component: AIAgent
  },
  {
    slug: 'education-agent',
    icon: '🎓',
    category: 'education',
    name: 'Education Agent',
    description: 'AI-generated study plan: courses, learning paths, and milestones.',
    seoDescription:
      'Free AI education planning agent. Describe what you want to learn to get an AI-generated study plan, resources, and milestones.',
    agentKey: 'education',
    component: AIAgent
  },
  {
    slug: 'finance-agent',
    icon: '💰',
    category: 'finance',
    name: 'Finance Agent',
    description: 'AI-generated financial plan: budget breakdown, expense analysis, and savings strategy.',
    seoDescription:
      'Free AI finance planning agent. Enter your income and expenses to get an AI-generated budget breakdown, savings plan, and financial recommendations.',
    agentKey: 'finance',
    component: AIAgent
  },
  {
    slug: 'restaurant-agent',
    icon: '🍽️',
    category: 'restaurant',
    name: 'Restaurant Agent',
    description: 'AI-generated restaurant plan: menu planning, food costs, and recipe/concept ideas.',
    seoDescription:
      'Free AI restaurant planning agent. Describe your restaurant concept to get an AI-generated menu plan, food cost estimate, and staffing plan.',
    agentKey: 'restaurant',
    component: AIAgent
  },
  {
    slug: 'vehicle-agent',
    icon: '🚗',
    category: 'vehicle',
    name: 'Vehicle Agent',
    description: 'AI-generated vehicle plan: maintenance schedule, ownership costs, and comparisons.',
    seoDescription:
      'Free AI vehicle planning agent. Describe your vehicle needs to get an AI-generated ownership cost estimate, maintenance schedule, and comparable options.',
    agentKey: 'vehicle',
    component: AIAgent
  },
  {
    slug: 'energy-agent',
    icon: '⚡',
    category: 'energy',
    name: 'Energy Agent',
    description: 'AI-generated energy plan: electricity usage analysis, solar sizing, and estimated savings.',
    seoDescription:
      'Free AI energy planning agent. Enter your electricity usage to get an AI-generated solar sizing estimate and projected savings.',
    agentKey: 'energy',
    component: AIAgent
  }
];
export function getAgentBySlug(slug) {
  return AGENTS.find((a) => a.slug === slug);
}
