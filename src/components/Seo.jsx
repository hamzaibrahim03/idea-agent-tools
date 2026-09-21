import { useEffect } from 'react';
const SITE_NAME = 'idea-agent';
const SITE_URL = 'https://idea-agent-six.vercel.app';
function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
/**
 * Sets document title + meta description + OG/Twitter tags + canonical URL
 * for the current page. Plain DOM writes (no react-helmet dependency) since
 * this is a small SPA and only ever renders one page's head at a time.
 */
export default function Seo({ title, description, path = '' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Free Developer Tools`;
    const url = `${SITE_URL}${path}`;
    document.title = fullTitle;
    setMeta('description', description);
    setCanonical(url);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
  }, [title, description, path]);
  return null;
}
export { SITE_URL, SITE_NAME };
