export const AFFILIATE_LINKS = [
  {
    id: 'hosting',
    label: 'Deploying a side project? Try Vercel',
    href: 'https://vercel.com',
    enabled: false
  }
];
export function getAffiliateLink(id) {
  const link = AFFILIATE_LINKS.find((l) => l.id === id);
  return link && link.enabled ? link : null;
}
