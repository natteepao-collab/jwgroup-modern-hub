-- Create storage bucket for chairman images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chairman-images', 'chairman-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Anyone can view chairman images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chairman-images');

-- Create policy for admin upload
CREATE POLICY "Admins can upload chairman images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chairman-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Create policy for admin update
CREATE POLICY "Admins can update chairman images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chairman-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Create policy for admin delete
CREATE POLICY "Admins can delete chairman images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chairman-images' 
  AND public.has_role(auth.uid(), 'admin')
);