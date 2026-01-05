-- Add business_type column to news table
ALTER TABLE public.news 
ADD COLUMN business_type text DEFAULT 'real_estate';

-- Add check constraint for valid business types
ALTER TABLE public.news 
ADD CONSTRAINT news_business_type_check 
CHECK (business_type IN ('real_estate', 'hotel', 'pet', 'wellness'));