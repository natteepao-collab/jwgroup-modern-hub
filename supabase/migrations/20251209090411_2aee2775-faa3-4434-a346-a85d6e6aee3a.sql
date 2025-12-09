-- Create executives table for managing executive team
CREATE TABLE public.executives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  position_order INTEGER NOT NULL DEFAULT 0,
  is_chairman BOOLEAN NOT NULL DEFAULT false,
  quote TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.executives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read executives" 
ON public.executives 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert executives" 
ON public.executives 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update executives" 
ON public.executives 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete executives" 
ON public.executives 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_executives_updated_at
BEFORE UPDATE ON public.executives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.executives (name, title, description, is_chairman, quote, position_order) VALUES
('คุณวิสิทธิ์ กอวรกุล', 'ประธานกรรมการบริษัท', 'ผู้ก่อตั้งและประธานกลุ่มบริษัท JW GROUP', true, 'เราเชื่อมั่นในการสร้างธุรกิจที่ยั่งยืน ควบคู่ไปกับการพัฒนาคุณภาพชีวิตของสังคม', 1),
('คุณชาลิสา กอวรกุล', 'กรรมการผู้จัดการ', 'บริหารธุรกิจอสังหาริมทรัพย์และโรงแรม', false, NULL, 2),
('คุณพรณัชชา กอวรกุล', 'กรรมการผู้จัดการ', 'บริหารธุรกิจสุขภาพและสัตว์เลี้ยง', false, NULL, 3);

-- Create storage bucket for executive images
INSERT INTO storage.buckets (id, name, public) VALUES ('executive-images', 'executive-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for executive images
CREATE POLICY "Executive images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'executive-images');

CREATE POLICY "Admins can upload executive images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'executive-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update executive images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'executive-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete executive images"
ON storage.objects FOR DELETE
USING (bucket_id = 'executive-images' AND has_role(auth.uid(), 'admin'::app_role));