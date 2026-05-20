
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  language TEXT DEFAULT 'th',
  page_url TEXT,
  referrer TEXT,
  topics TEXT[] DEFAULT '{}',
  message_count INTEGER NOT NULL DEFAULT 0,
  last_user_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_chat_conversations_started_at ON public.chat_conversations(started_at DESC);
CREATE INDEX idx_chat_conversations_session_id ON public.chat_conversations(session_id);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id, created_at);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous chat from website visitors). Writes go through edge function with service role anyway, but allow inserts for safety.
CREATE POLICY "Anyone can start chat conversation" ON public.chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own conversation by session" ON public.chat_conversations FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Only admins can read for marketing analytics
CREATE POLICY "Admins can view conversations" ON public.chat_conversations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete conversations" ON public.chat_conversations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view chat messages" ON public.chat_messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete chat messages" ON public.chat_messages FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
