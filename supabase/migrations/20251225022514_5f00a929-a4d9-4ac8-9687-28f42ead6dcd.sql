-- Fix news-images storage policies to require admin role only

-- Drop existing permissive policies for news-images bucket
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news images" ON storage.objects;

-- Create admin-only policies for news-images bucket
CREATE POLICY "Admin can upload news images"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can update news images"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can delete news images"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);