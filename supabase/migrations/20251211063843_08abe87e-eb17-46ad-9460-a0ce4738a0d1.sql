-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_image_url TEXT,
  content_th TEXT NOT NULL,
  content_en TEXT,
  content_cn TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create awards table
CREATE TABLE public.awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_th TEXT NOT NULL,
  title_en TEXT,
  title_cn TEXT,
  description_th TEXT,
  description_en TEXT,
  description_cn TEXT,
  image_url TEXT,
  award_year INTEGER,
  awarding_organization TEXT,
  category TEXT DEFAULT 'award',
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- Testimonials RLS Policies
CREATE POLICY "Anyone can read published testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all testimonials" 
ON public.testimonials 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Awards RLS Policies
CREATE POLICY "Anyone can read published awards" 
ON public.awards 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all awards" 
ON public.awards 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert awards" 
ON public.awards 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update awards" 
ON public.awards 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete awards" 
ON public.awards 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for testimonials and awards images
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-images', 'testimonial-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('award-images', 'award-images', true);

-- Storage policies for testimonial-images
CREATE POLICY "Anyone can view testimonial images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'testimonial-images');

CREATE POLICY "Admins can upload testimonial images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonial images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonial images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for award-images
CREATE POLICY "Anyone can view award images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'award-images');

CREATE POLICY "Admins can upload award images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'award-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update award images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'award-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete award images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'award-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();