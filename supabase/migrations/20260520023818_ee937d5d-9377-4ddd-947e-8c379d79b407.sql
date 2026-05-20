
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_label text,
  business_key text,
  page_path text,
  referrer text,
  session_id text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_business ON public.analytics_events(business_key);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete analytics"
  ON public.analytics_events FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
