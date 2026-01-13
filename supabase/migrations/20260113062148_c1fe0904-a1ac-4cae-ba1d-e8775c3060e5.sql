-- Create cookie_settings table for managing cookie consent content
CREATE TABLE public.cookie_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  title_th TEXT,
  title_en TEXT,
  description_th TEXT,
  description_en TEXT,
  is_required BOOLEAN DEFAULT false,
  position_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cookie_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (needed for frontend)
CREATE POLICY "Cookie settings are publicly readable"
ON public.cookie_settings
FOR SELECT
USING (true);

-- Create policy for admin write access
CREATE POLICY "Admins can manage cookie settings"
ON public.cookie_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_cookie_settings_updated_at
BEFORE UPDATE ON public.cookie_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default cookie types
INSERT INTO public.cookie_settings (setting_key, title_th, title_en, description_th, description_en, is_required, position_order) VALUES
('popup_title', 'เราใช้คุกกี้', 'We use cookies', 'เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ', 'This website uses cookies to improve your experience', false, 0),
('necessary', 'คุกกี้ที่จำเป็น', 'Necessary Cookies', 'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้', 'These cookies are essential for the website to function and cannot be disabled', true, 1),
('analytics', 'คุกกี้วิเคราะห์', 'Analytics Cookies', 'ช่วยให้เราเข้าใจวิธีการใช้งานเว็บไซต์ของผู้เยี่ยมชม', 'Help us understand how visitors use our website', false, 2),
('marketing', 'คุกกี้การตลาด', 'Marketing Cookies', 'ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ', 'Used to display ads relevant to your interests', false, 3);