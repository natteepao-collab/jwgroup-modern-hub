-- Add business_type column to org_departments
ALTER TABLE public.org_departments 
ADD COLUMN business_type text DEFAULT 'jw_group';

-- Add comment for clarity
COMMENT ON COLUMN public.org_departments.business_type IS 'Business type: jw_group, realestate, hotel, pet, wellness, construction';