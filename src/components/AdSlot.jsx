import { useEffect, useRef } from 'react';
const ADSENSE_CLIENT = 'ca-pub-0000000000000000';
const ADSENSE_ENABLED = false;
export default function AdSlot({ slot, format = 'auto', style }) {
  const insRef = useRef(null);
  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
    }
  }, []);
  if (!ADSENSE_ENABLED) return null;
  return (
    <ins ref={insRef} className="adsbygoogle" style={{ display: 'block', minHeight: 90, ...style }} data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
  );
}
