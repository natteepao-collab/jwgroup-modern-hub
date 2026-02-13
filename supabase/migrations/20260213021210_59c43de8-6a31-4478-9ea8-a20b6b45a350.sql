
-- Allow admins to update contact submissions
CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete contact submissions
CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
