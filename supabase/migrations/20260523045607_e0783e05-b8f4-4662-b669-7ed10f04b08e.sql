
-- 1. Tighten chat_messages INSERT: require conversation to exist
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;

CREATE POLICY "Anyone can insert messages to existing conversations"
ON public.chat_messages
FOR INSERT
TO public
WITH CHECK (
  EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = conversation_id)
);

-- 2. Tighten resume upload: enforce MIME type + size limit on bucket
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
WHERE id = 'resumes';

-- 3. Revoke EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_email_format() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
