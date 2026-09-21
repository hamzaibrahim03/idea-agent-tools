import { useParams, Link } from 'react-router-dom';
import { getToolBySlug } from '../toolRegistry.js';
import Seo from './Seo.jsx';
import AdSlot from './AdSlot.jsx';
import AffiliateCallout from './AffiliateCallout.jsx';
export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);
  if (!tool) {
    return (
      <div className="tool-page">
        <Seo title="Tool not found" description="That tool doesn't exist." path={`/tools/${slug}`} />
        <h1>Tool not found</h1>
        <p>
          That tool doesn't exist. <Link to="/">Browse all tools</Link>.
        </p>
      </div>
    );
  }
  const ToolComponent = tool.component;
  return (
    <>
      <Seo title={tool.name} description={tool.seoDescription || tool.description} path={`/tools/${tool.slug}`} />
      <ToolComponent />
      <AffiliateCallout id="hosting" />
      <AdSlot slot="0000000001" style={{ marginTop: 32 }} />
    </>
  );
}
