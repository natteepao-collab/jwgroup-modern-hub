-- Add image_url column to vision_missions table for business images
ALTER TABLE public.vision_missions 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Create storage bucket for vision-mission images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('vision-mission-images', 'vision-mission-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for vision-mission-images bucket
CREATE POLICY "Public can view vision-mission images"
ON storage.objects FOR SELECT
USING (bucket_id = 'vision-mission-images');

CREATE POLICY "Admins can upload vision-mission images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vision-mission-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update vision-mission images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vision-mission-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete vision-mission images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vision-mission-images' 
  AND public.has_role(auth.uid(), 'admin')
);