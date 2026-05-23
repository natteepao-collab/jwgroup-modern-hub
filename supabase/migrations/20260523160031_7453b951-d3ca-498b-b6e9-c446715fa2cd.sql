
-- 1) Input validation: contact_submissions
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT contact_name_len     CHECK (char_length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT contact_message_len  CHECK (char_length(message) BETWEEN 1 AND 5000),
  ADD CONSTRAINT contact_subject_len  CHECK (subject IS NULL OR char_length(subject) <= 300),
  ADD CONSTRAINT contact_phone_len    CHECK (phone   IS NULL OR char_length(phone)   <= 50);

-- 2) Input validation: newsletter_subscribers
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT newsletter_name_len     CHECK (name IS NULL OR char_length(name) <= 200);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique
  ON public.newsletter_subscribers (lower(email));

-- 3) Input validation: job_applications
ALTER TABLE public.job_applications
  ADD CONSTRAINT job_app_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT job_app_name_len     CHECK (char_length(full_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT job_app_phone_len    CHECK (char_length(phone) BETWEEN 1 AND 50),
  ADD CONSTRAINT job_app_cover_len    CHECK (cover_letter IS NULL OR char_length(cover_letter) <= 5000),
  ADD CONSTRAINT job_app_edu_len      CHECK (education    IS NULL OR char_length(education)    <= 2000),
  ADD CONSTRAINT job_app_exp_len      CHECK (experience   IS NULL OR char_length(experience)   <= 5000);

-- 4) translations_cache: restrict INSERT to admins (edge function uses service role and bypasses RLS)
DROP POLICY IF EXISTS "Anyone can insert translations" ON public.translations_cache;
CREATE POLICY "Admins can insert translations"
  ON public.translations_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5) Lock down SECURITY DEFINER helper functions (these are only meant to be invoked
--    by triggers, never directly by API consumers).
REVOKE EXECUTE ON FUNCTION public.handle_new_user()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin()  FROM PUBLIC, anon, authenticated;
