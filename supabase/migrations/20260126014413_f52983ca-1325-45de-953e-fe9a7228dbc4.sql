-- Create jobs table for career listings
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_th TEXT NOT NULL,
  title_en TEXT,
  department_th TEXT,
  department_en TEXT,
  location_th TEXT,
  location_en TEXT,
  job_type TEXT DEFAULT 'full-time',
  description_th TEXT,
  description_en TEXT,
  requirements_th TEXT,
  requirements_en TEXT,
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create benefits table
CREATE TABLE public.career_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_th TEXT NOT NULL,
  title_en TEXT,
  description_th TEXT,
  description_en TEXT,
  icon_name TEXT DEFAULT 'gift',
  is_published BOOLEAN DEFAULT true,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_benefits ENABLE ROW LEVEL SECURITY;

-- RLS policies for jobs
CREATE POLICY "Anyone can read published jobs" ON public.jobs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all jobs" ON public.jobs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update jobs" ON public.jobs
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete jobs" ON public.jobs
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for career_benefits
CREATE POLICY "Anyone can read published benefits" ON public.career_benefits
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all benefits" ON public.career_benefits
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert benefits" ON public.career_benefits
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update benefits" ON public.career_benefits
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete benefits" ON public.career_benefits
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_benefits_updated_at
  BEFORE UPDATE ON public.career_benefits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.career_benefits (title_th, title_en, icon_name, position_order) VALUES
  ('ประกันสุขภาพและอุบัติเหตุ', 'Health and Accident Insurance', 'shield', 1),
  ('โบนัสประจำปี', 'Annual Bonus', 'gift', 2),
  ('วันหยุดพักผ่อนประจำปี', 'Annual Leave', 'calendar', 3),
  ('ค่าเดินทาง', 'Transportation Allowance', 'car', 4),
  ('ส่วนลดสินค้าและบริการในเครือ', 'Employee Discounts', 'percent', 5),
  ('โอกาสในการพัฒนาและเติบโตในสายงาน', 'Career Development Opportunities', 'trending-up', 6);

INSERT INTO public.jobs (title_th, title_en, department_th, department_en, location_th, location_en, job_type, description_th, description_en, position_order) VALUES
  ('Digital Marketing Manager', 'Digital Marketing Manager', 'Marketing', 'Marketing', 'กรุงเทพฯ', 'Bangkok', 'full-time', 'วางแผนและบริหารกลยุทธ์การตลาดดิจิทัล สร้างแคมเปญออนไลน์', 'Plan and manage digital marketing strategies, create online campaigns', 1),
  ('Property Sales Executive', 'Property Sales Executive', 'Real Estate', 'Real Estate', 'กรุงเทพฯ', 'Bangkok', 'full-time', 'ขายและนำเสนอโครงการอสังหาริมทรัพย์ ดูแลลูกค้าและปิดการขาย', 'Sell and present real estate projects, manage customer relationships', 2),
  ('Veterinarian', 'Veterinarian', '3DPet Hospital', '3DPet Hospital', 'กรุงเทพฯ', 'Bangkok', 'full-time', 'ให้บริการรักษาสัตว์ ตรวจวินิจฉัย และดูแลสุขภาพสัตว์เลี้ยง', 'Provide veterinary services, diagnose and care for pets', 3),
  ('Hotel Manager', 'Hotel Manager', '12 The Residence', '12 The Residence', 'กรุงเทพฯ', 'Bangkok', 'full-time', 'บริหารจัดการโรงแรม ดูแลการบริการและความพึงพอใจของแขก', 'Manage hotel operations, oversee service and guest satisfaction', 4);