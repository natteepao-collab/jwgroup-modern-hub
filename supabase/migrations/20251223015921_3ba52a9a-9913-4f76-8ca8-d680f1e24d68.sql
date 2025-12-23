-- Drop all existing storage policies for all buckets first
DROP POLICY IF EXISTS "Admins can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete news images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view news images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload executive images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update executive images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete executive images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view executive images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload timeline images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update timeline images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete timeline images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view timeline images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view testimonial images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload award images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update award images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete award images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view award images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload chairman images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update chairman images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete chairman images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view chairman images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view site images" ON storage.objects;

-- Recreate all policies for news-images
CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news images"
ON storage.objects FOR DELETE
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Recreate all policies for executive-images
CREATE POLICY "Admins can upload executive images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'executive-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update executive images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'executive-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete executive images"
ON storage.objects FOR DELETE
USING (bucket_id = 'executive-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view executive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'executive-images');

-- Recreate all policies for timeline-images
CREATE POLICY "Admins can upload timeline images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'timeline-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update timeline images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'timeline-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete timeline images"
ON storage.objects FOR DELETE
USING (bucket_id = 'timeline-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view timeline images"
ON storage.objects FOR SELECT
USING (bucket_id = 'timeline-images');

-- Recreate all policies for testimonial-images
CREATE POLICY "Admins can upload testimonial images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonial images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonial images"
ON storage.objects FOR DELETE
USING (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view testimonial images"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-images');

-- Recreate all policies for award-images
CREATE POLICY "Admins can upload award images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'award-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update award images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'award-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete award images"
ON storage.objects FOR DELETE
USING (bucket_id = 'award-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view award images"
ON storage.objects FOR SELECT
USING (bucket_id = 'award-images');

-- Recreate all policies for chairman-images
CREATE POLICY "Admins can upload chairman images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chairman-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chairman images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'chairman-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chairman images"
ON storage.objects FOR DELETE
USING (bucket_id = 'chairman-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view chairman images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chairman-images');

-- Recreate all policies for site-images
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');