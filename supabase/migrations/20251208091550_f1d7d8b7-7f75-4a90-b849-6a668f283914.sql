-- Enable realtime for news table
ALTER TABLE public.news REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;