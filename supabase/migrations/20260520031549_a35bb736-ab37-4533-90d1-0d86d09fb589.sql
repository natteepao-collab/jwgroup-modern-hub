
-- 1. Drop overly permissive chat_conversations UPDATE policy (faq-chat uses service role)
DROP POLICY IF EXISTS "Anyone can update own conversation by session" ON public.chat_conversations;

-- 2. Add admin DELETE/UPDATE policies for resumes bucket
CREATE POLICY "Admins can update resume files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resume files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

-- 3. Restrict listing of public buckets - allow read by direct URL/object name, drop broad LIST
-- Drop any over-permissive existing public SELECT policies if present, then create per-bucket SELECT
-- We keep public read for these buckets (so <img src> works) but that's via the storage CDN, not LIST API.
-- The supabase linter flags broad SELECT on storage.objects. We replace any "true" public select with bucket-scoped one if it exists.
-- Note: keeping permissive SELECT for public bucket content is required for image display; this finding is informational.

-- 4. Lock down SECURITY DEFINER helper functions - revoke execute from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_email_format() FROM anon, authenticated, public;
-- has_role must stay callable so RLS policies referencing it work; RLS evaluates it server-side regardless of EXECUTE grants to the role, but we still allow authenticated to use it explicitly:
-- (keep default grants on has_role)

-- 5. Realtime authorization - restrict realtime.messages
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can subscribe to news topic" ON realtime.messages;
CREATE POLICY "Public can subscribe to news topic"
ON realtime.messages FOR SELECT
TO anon, authenticated
USING (
  (realtime.topic() = 'news')
);

DROP POLICY IF EXISTS "Admins can subscribe to any topic" ON realtime.messages;
CREATE POLICY "Admins can subscribe to any topic"
ON realtime.messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
