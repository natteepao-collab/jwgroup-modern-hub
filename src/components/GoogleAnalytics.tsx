import { useEffect } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

/**
 * Loads Google Analytics 4 (gtag.js) when admin has set ga4_measurement_id in site_content.
 * Safe to render anywhere — does nothing without an ID. Also initializes window.dataLayer
 * so trackEvent() can push events even before GA loads.
 */
export const GoogleAnalytics = () => {
  const { getContent } = useSiteContent();
  const measurementId = (getContent('ga4_measurement_id').content || '').trim();

  useEffect(() => {
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    if (document.getElementById('ga4-loader')) return;

    const script = document.createElement('script');
    script.id = 'ga4-loader';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag(...args: unknown[]) { w.dataLayer.push(args); };
    w.gtag('js', new Date());
    w.gtag('config', measurementId, { anonymize_ip: true });
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics;
