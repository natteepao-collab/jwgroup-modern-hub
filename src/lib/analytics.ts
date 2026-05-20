import { supabase } from '@/integrations/supabase/client';

// Persistent session id (per browser session)
const SESSION_KEY = 'jw_analytics_session';
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'business_view'
  | 'business_card_click'
  | 'contact_submit'
  | 'contact_form_open'
  | 'job_view'
  | 'job_apply'
  | 'line_click'
  | 'phone_click'
  | 'email_click'
  | 'news_view'
  | 'newsletter_subscribe';

export interface TrackPayload {
  label?: string;
  business?: string;
  metadata?: Record<string, unknown>;
}

/** Fire-and-forget analytics call. Never blocks UI. */
export function trackEvent(eventType: AnalyticsEvent, payload: TrackPayload = {}) {
  if (typeof window === 'undefined') return;

  const path = window.location.pathname;
  const referrer = document.referrer || null;
  const sessionId = getSessionId();

  // 1) Push to GA4 dataLayer (gtag)
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventType,
      event_label: payload.label,
      business_key: payload.business,
      page_path: path,
      ...payload.metadata,
    });
  } catch {
    /* ignore */
  }

  // 2) Persist to Supabase (async, non-blocking)
  supabase
    .from('analytics_events')
    .insert([{
      event_type: eventType,
      event_label: payload.label ?? null,
      business_key: payload.business ?? null,
      page_path: path,
      referrer,
      session_id: sessionId,
      user_agent: navigator.userAgent.slice(0, 255),
      metadata: (payload.metadata ?? {}) as never,
    }])
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn('[analytics] insert failed:', error.message);
      }
    });
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn('[analytics] insert failed:', error.message);
      }
    });
}
