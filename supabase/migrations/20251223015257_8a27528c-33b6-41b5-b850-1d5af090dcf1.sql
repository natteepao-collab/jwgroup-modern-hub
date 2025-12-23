-- Drop existing policies and recreate with correct conditions
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;

-- Allow admins to upload images to project-images bucket
CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update project images
CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete project images
CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow public read access to project images
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');