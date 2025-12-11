-- Create projects table for gallery
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_type TEXT NOT NULL CHECK (business_type IN ('realestate', 'hotel', 'pet', 'wellness')),
  name_th TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  description_th TEXT,
  description_en TEXT,
  description_cn TEXT,
  location_th TEXT,
  location_en TEXT,
  year_completed TEXT,
  image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects
CREATE POLICY "Anyone can read published projects"
ON public.projects FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all projects"
ON public.projects FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website'
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for newsletter - anyone can subscribe, only admins can view
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();