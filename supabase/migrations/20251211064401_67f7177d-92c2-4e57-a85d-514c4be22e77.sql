-- Create timeline_events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title_th TEXT NOT NULL,
  title_en TEXT,
  title_cn TEXT,
  description_th TEXT,
  description_en TEXT,
  description_cn TEXT,
  image_url TEXT,
  icon_name TEXT DEFAULT 'building',
  is_highlight BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read published timeline events" 
ON public.timeline_events 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all timeline events" 
ON public.timeline_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert timeline events" 
ON public.timeline_events 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update timeline events" 
ON public.timeline_events 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete timeline events" 
ON public.timeline_events 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for timeline images
INSERT INTO storage.buckets (id, name, public) VALUES ('timeline-images', 'timeline-images', true);

-- Storage policies
CREATE POLICY "Anyone can view timeline images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'timeline-images');

CREATE POLICY "Admins can upload timeline images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update timeline images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete timeline images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'timeline-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();