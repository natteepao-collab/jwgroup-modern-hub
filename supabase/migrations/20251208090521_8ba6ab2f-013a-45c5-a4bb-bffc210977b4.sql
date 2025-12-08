-- Create news table for dynamic news management
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_th TEXT NOT NULL,
  title_en TEXT,
  title_cn TEXT,
  excerpt_th TEXT,
  excerpt_en TEXT,
  excerpt_cn TEXT,
  content_th TEXT,
  content_en TEXT,
  content_cn TEXT,
  category TEXT NOT NULL DEFAULT 'company',
  image_url TEXT,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policies for news access
CREATE POLICY "Anyone can read published news" 
ON public.news 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all news" 
ON public.news 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert news" 
ON public.news 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update news" 
ON public.news 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete news" 
ON public.news 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_is_published ON public.news(is_published);

-- Insert sample news data
INSERT INTO public.news (title_th, title_en, excerpt_th, excerpt_en, category, image_url, is_featured, published_at) VALUES
('JW Group เปิดตัวโครงการอสังหาริมทรัพย์ใหม่มูลค่ากว่า 5,000 ล้านบาท', 'JW Group launches new 5 billion baht real estate project', 'กลุ่มบริษัท JW Group ประกาศเปิดตัวโครงการอสังหาริมทรัพย์ระดับพรีเมียมใจกลางกรุงเทพฯ พร้อมสิ่งอำนวยความสะดวกครบครันและดีไซน์สมัยใหม่', 'JW Group announces premium real estate project in central Bangkok with full amenities and modern design', 'company', '/business-realestate.jpg', true, now()),
('12 The Residence Hotel คว้ารางวัลโรงแรมบูติกยอดเยี่ยม 2024', '12 The Residence Hotel wins Best Boutique Hotel 2024', 'โรงแรม 12 The Residence ได้รับรางวัลโรงแรมบูติกยอดเยี่ยมแห่งปี 2024 จากสมาคมโรงแรมไทย ด้วยมาตรฐานการบริการที่เป็นเลิศ', '12 The Residence Hotel receives Best Boutique Hotel of the Year 2024 award from Thai Hotels Association', 'press', '/business-hotel.jpg', false, now() - interval '5 days'),
('3DPet Hospital เปิดสาขาใหม่ พร้อมเทคโนโลยีการรักษาสัตว์ล้ำสมัย', '3DPet Hospital opens new branch with advanced technology', 'โรงพยาบาลสัตว์ 3DPet ขยายสาขาครั้งใหญ่ พร้อมนำเข้าเทคโนโลยีการรักษาสัตว์ระดับโลก', '3DPet Hospital expands with world-class veterinary technology', 'company', '/business-pet.jpg', false, now() - interval '10 days'),
('JW Group ร่วมกับมหาวิทยาลัยชั้นนำพัฒนาผลิตภัณฑ์สมุนไพร', 'JW Group partners with leading university for herbal products', 'ความร่วมมือครั้งใหม่ในการวิจัยและพัฒนาผลิตภัณฑ์สมุนไพรและเวลเนส เพื่อสุขภาพที่ดีของคนไทย', 'New partnership in research and development of herbal and wellness products', 'company', '/business-wellness.jpg', false, now() - interval '15 days'),
('JW Group ประกาศนโยบาย ESG และความยั่งยืน', 'JW Group announces ESG and sustainability policy', 'เปิดตัวนโยบาย ESG ฉบับใหม่ มุ่งสู่องค์กรที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม', 'Launch of new ESG policy towards sustainable and environmentally friendly organization', 'press', '/business-hotel.jpg', false, now() - interval '20 days');