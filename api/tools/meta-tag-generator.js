import { createComputeHandler } from '../_lib/computeHandler.js';

function buildMetaTags(fields) {
  const lines = [];
  if (fields.title.trim()) lines.push(`<title>${fields.title.trim()}</title>`);
  if (fields.description.trim()) {
    lines.push(`<meta name="description" content="${fields.description.trim()}">`);
  }
  if (fields.keywords.trim()) lines.push(`<meta name="keywords" content="${fields.keywords.trim()}">`);
  if (fields.author.trim()) lines.push(`<meta name="author" content="${fields.author.trim()}">`);
  if (fields.ogTitle.trim()) lines.push(`<meta property="og:title" content="${fields.ogTitle.trim()}">`);
  if (fields.ogDescription.trim()) {
    lines.push(`<meta property="og:description" content="${fields.ogDescription.trim()}">`);
  }
  if (fields.ogImage.trim()) lines.push(`<meta property="og:image" content="${fields.ogImage.trim()}">`);
  if (fields.twitterCard) lines.push(`<meta name="twitter:card" content="${fields.twitterCard}">`);
  if (fields.canonicalUrl.trim()) lines.push(`<link rel="canonical" href="${fields.canonicalUrl.trim()}">`);
  return lines.join('\n');
}

function compute({ fields }) {
  const f = fields || {};
  const normalized = {
    title: f.title || '',
    description: f.description || '',
    keywords: f.keywords || '',
    author: f.author || '',
    ogTitle: f.ogTitle || '',
    ogDescription: f.ogDescription || '',
    ogImage: f.ogImage || '',
    twitterCard: f.twitterCard || 'summary',
    canonicalUrl: f.canonicalUrl || '',
  };
  return { output: buildMetaTags(normalized) };
}

export default createComputeHandler(compute);
