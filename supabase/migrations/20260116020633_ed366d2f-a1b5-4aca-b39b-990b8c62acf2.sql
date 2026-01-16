-- Create table for business types configuration
CREATE TABLE public.business_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_key TEXT NOT NULL UNIQUE,
  name_th TEXT NOT NULL,
  name_en TEXT,
  icon_name TEXT DEFAULT 'building',
  color TEXT DEFAULT '#d97706',
  position_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active business types"
ON public.business_types
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all business types"
ON public.business_types
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert business types"
ON public.business_types
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update business types"
ON public.business_types
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete business types"
ON public.business_types
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default business types
INSERT INTO public.business_types (business_key, name_th, name_en, icon_name, color, position_order) VALUES
('realestate', 'บริษัทเจดับบลิว เรียลเอสเตท จำกัด', 'JW Real Estate Co., Ltd.', 'building', '#d97706', 1),
('hotel', 'โรงแรม', 'Hotel', 'hotel', '#3b82f6', 2),
('pet', 'สัตว์เลี้ยง', 'Pet', 'heart', '#ec4899', 3),
('wellness', 'สุขภาพ', 'Wellness', 'leaf', '#10b981', 4),
('construction', 'ก่อสร้าง', 'Construction', 'hard-hat', '#6b7280', 5);

-- Create trigger for updated_at
CREATE TRIGGER update_business_types_updated_at
BEFORE UPDATE ON public.business_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();