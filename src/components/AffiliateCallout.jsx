import { getAffiliateLink } from '../affiliateLinks.js';
export default function AffiliateCallout({ id }) {
  const link = getAffiliateLink(id);
  if (!link) return null;
  return (
    <p className="affiliate-callout">
      {link.label} —{' '}
      <a href={link.href} target="_blank" rel="noopener noreferrer sponsored">
        learn more
      </a>
      <span className="affiliate-disclosure"> (affiliate link)</span>
    </p>
  );
}
