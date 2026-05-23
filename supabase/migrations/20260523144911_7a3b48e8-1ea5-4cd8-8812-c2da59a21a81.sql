CREATE TABLE public.translations_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_hash TEXT NOT NULL,
  source_text TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (source_hash, target_lang)
);

CREATE INDEX idx_translations_lookup ON public.translations_cache (source_hash, target_lang);

ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations"
  ON public.translations_cache FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert translations"
  ON public.translations_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update translations"
  ON public.translations_cache FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete translations"
  ON public.translations_cache FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));