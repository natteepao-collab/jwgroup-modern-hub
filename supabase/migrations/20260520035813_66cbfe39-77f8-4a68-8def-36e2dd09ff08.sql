
-- Enforce size + MIME restrictions at bucket level (server-side, cannot be bypassed by client)
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
WHERE id = 'resumes';

-- Tighten the public INSERT policy: restrict to allowed file extensions
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;

CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'resumes'
  AND lower(storage.extension(name)) IN ('pdf', 'doc', 'docx')
);
