-- Create a trigger function to assign admin role to the first user
CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count existing profiles (excluding the one being inserted)
  SELECT COUNT(*) INTO user_count FROM public.profiles WHERE id != NEW.id;
  
  -- If this is the first user (no other profiles exist), assign admin role
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after a new profile is inserted
DROP TRIGGER IF EXISTS on_first_user_assign_admin ON public.profiles;
CREATE TRIGGER on_first_user_assign_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_user_admin();