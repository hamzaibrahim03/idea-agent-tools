import { useParams, Link } from 'react-router-dom';
import { getToolBySlug } from '../toolRegistry.js';

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="tool-page">
        <h1>Tool not found</h1>
        <p>
          That tool doesn't exist. <Link to="/">Browse all tools</Link>.
        </p>
      </div>
    );
  }

  const ToolComponent = tool.component;
  return <ToolComponent />;
}
