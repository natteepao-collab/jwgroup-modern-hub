-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to delete user_roles (already covered by existing "Admins can manage roles" policy)