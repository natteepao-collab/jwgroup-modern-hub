-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles - only admins can manage roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_content table for editable text content
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    title_th TEXT,
    title_en TEXT,
    title_cn TEXT,
    content_th TEXT,
    content_en TEXT,
    content_cn TEXT,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read site content
CREATE POLICY "Anyone can read site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can update site content
CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create site_images table for editable images
CREATE TABLE public.site_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_images
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read site images
CREATE POLICY "Anyone can read site images"
ON public.site_images
FOR SELECT
USING (true);

-- Only admins can manage site images
CREATE POLICY "Admins can update site images"
ON public.site_images
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site images"
ON public.site_images
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create profiles table for user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updating timestamps
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content sections for homepage
INSERT INTO public.site_content (section_key, title_th, title_en, title_cn, content_th, content_en, content_cn) VALUES
('hero_headline', 'สร้างอนาคต ด้วยคุณภาพ', 'Building the Future with Quality', '以品质创造未来', 'กลุ่มธุรกิจที่มุ่งมั่นพัฒนาคุณภาพชีวิต', 'A business group committed to improving quality of life', '致力于提升生活品质的企业集团'),
('about_section', 'เกี่ยวกับ JW Group', 'About JW Group', '关于JW集团', 'JW GROUP ก่อตั้งขึ้นในปี พ.ศ. 2550 จากความเชี่ยวชาญด้านอสังหาริมทรัพย์', 'JW GROUP was established in 2007 from real estate expertise', 'JW集团成立于2007年，源于房地产专业领域'),
('business_section', 'ธุรกิจของเรา', 'Our Businesses', '我们的业务', 'กลุ่มธุรกิจครบวงจรที่ครอบคลุมหลากหลายอุตสาหกรรม', 'A comprehensive business group covering various industries', '涵盖多个行业的综合性企业集团'),
('news_section', 'ข่าวสารล่าสุด', 'Latest News', '最新消息', 'ติดตามข่าวสารและความเคลื่อนไหวล่าสุดจาก JW Group', 'Follow the latest news and updates from JW Group', '关注JW集团的最新新闻和动态'),
('careers_section', 'ร่วมงานกับเรา', 'Join Our Team', '加入我们', 'ร่วมเป็นส่วนหนึ่งของครอบครัว JW Group', 'Be part of the JW Group family', '成为JW集团大家庭的一员');

-- Insert default hero video
INSERT INTO public.site_images (section_key, image_url, alt_text) VALUES
('hero_video', 'https://storage.googleapis.com/nbcloudbucket/video/jw/JW%20PARK%20HOME%20OFFICE_Final_260623.mp4', 'JW Group Hero Video');