-- Add server-side email validation trigger for newsletter_subscribers
CREATE OR REPLACE FUNCTION public.validate_email_format()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate email format using regex
  IF NEW.email IS NULL OR NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format: %', COALESCE(NEW.email, 'NULL');
  END IF;
  
  -- Normalize email to lowercase
  NEW.email := LOWER(TRIM(NEW.email));
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT and UPDATE operations
DROP TRIGGER IF EXISTS validate_email_before_insert ON public.newsletter_subscribers;
CREATE TRIGGER validate_email_before_insert
  BEFORE INSERT OR UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email_format();