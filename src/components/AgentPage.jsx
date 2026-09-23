import { useParams, Link } from 'react-router-dom';
import { getAgentBySlug } from '../agentRegistry.js';
import Seo from './Seo.jsx';
import AdSlot from './AdSlot.jsx';
export default function AgentPage() {
  const { slug } = useParams();
  const agent = getAgentBySlug(slug);
  if (!agent) {
    return (
      <div className="tool-page">
        <Seo title="Agent not found" description="That agent doesn't exist." path={`/agents/${slug}`} />
        <h1>Agent not found</h1>
        <p>
          That agent doesn't exist. <Link to="/">Browse all tools and agents</Link>.
        </p>
      </div>
    );
  }
  const AgentComponent = agent.component;
  return (
    <>
      <Seo title={agent.name} description={agent.seoDescription || agent.description} path={`/agents/${agent.slug}`} />
      <AgentComponent />
      <AdSlot slot="0000000001" style={{ marginTop: 32 }} />
    </>
  );
}
