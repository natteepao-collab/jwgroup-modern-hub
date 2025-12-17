-- Create org_departments table for organization structure
CREATE TABLE public.org_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_th TEXT NOT NULL,
  name_en TEXT,
  description_th TEXT,
  description_en TEXT,
  level TEXT NOT NULL DEFAULT 'department', -- board, committee, executive, md, deputy, department
  parent_level TEXT, -- which level this reports to
  color TEXT DEFAULT '#4a7c9b', -- for styling
  sub_items JSONB DEFAULT '[]'::jsonb, -- array of sub-departments/units
  position_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.org_departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read published org departments"
ON public.org_departments
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all org departments"
ON public.org_departments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert org departments"
ON public.org_departments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update org departments"
ON public.org_departments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete org departments"
ON public.org_departments
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_org_departments_updated_at
BEFORE UPDATE ON public.org_departments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.org_departments (name_th, name_en, level, color, position_order, sub_items, description_th, description_en) VALUES
-- Board Level
('คณะกรรมการบริษัท', 'Board of Directors', 'board', '#2c5282', 1, '[]', 'คณะกรรมการบริษัทมีหน้าที่กำกับดูแลการบริหารจัดการของบริษัท', 'The Board of Directors oversees company management'),

-- Committee Level
('คณะกรรมการสรรหาและพิจารณาค่าตอบแทน', 'Nomination & Remuneration Committee', 'committee', '#d4a574', 1, '[]', 'รับผิดชอบในการสรรหาและกำหนดค่าตอบแทนของกรรมการและผู้บริหาร', 'Responsible for nomination and remuneration of directors and executives'),
('คณะกรรมการบริหารความเสี่ยงและการพัฒนาอย่างยั่งยืน', 'Risk Management & Sustainability Committee', 'committee', '#d4a574', 2, '[]', 'กำกับดูแลการบริหารความเสี่ยงและการพัฒนาอย่างยั่งยืนขององค์กร', 'Oversees risk management and sustainable development'),
('คณะกรรมการบริหาร', 'Executive Committee', 'committee', '#d4a574', 3, '[]', 'รับผิดชอบในการบริหารจัดการทั่วไปของบริษัท', 'Responsible for general management of the company'),
('คณะกรรมการตรวจสอบ', 'Audit Committee', 'committee', '#d4a574', 4, '[]', 'ตรวจสอบและกำกับดูแลด้านการเงินและการบัญชี', 'Audits and oversees financial and accounting matters'),

-- Chairman Level
('ประธานกรรมการบริษัทและประธานกรรมการบริหาร', 'Chairman of the Board & Chairman of Executive Committee', 'chairman', '#4a7c9b', 1, '[]', 'ผู้นำสูงสุดขององค์กร กำกับดูแลนโยบายและทิศทางของบริษัท', 'Top leader overseeing company policies and direction'),

-- MD Level
('กรรมการผู้จัดการ (สายปฏิบัติการ A)', 'Managing Director (Operations Line A)', 'md', '#c4d4d8', 1, '[]', 'รับผิดชอบสายงานปฏิบัติการ A ดูแลโครงการพัฒนา', 'Responsible for Operations Line A, overseeing project development'),
('กรรมการผู้จัดการ (สายปฏิบัติการ B)', 'Managing Director (Operations Line B)', 'md', '#c4d4d8', 2, '[]', 'รับผิดชอบสายงานปฏิบัติการ B ดูแลโครงการพัฒนา', 'Responsible for Operations Line B, overseeing project development'),
('กรรมการผู้จัดการ (สายงานสนับสนุน)', 'Managing Director (Support Line)', 'md', '#c4d4d8', 3, '[]', 'รับผิดชอบสายงานสนับสนุน ดูแลการบริหารและการเงิน', 'Responsible for Support Line, overseeing administration and finance'),

-- Deputy MD Level
('รองกรรมการผู้จัดการ', 'Deputy Managing Director', 'deputy', '#d4a574', 1, '[]', 'สนับสนุนการบริหารงานของกรรมการผู้จัดการ', 'Supports managing director operations'),
('รองกรรมการผู้จัดการและผู้บริหารสูงสุดด้านการเงิน', 'Deputy Managing Director & Chief Financial Officer', 'deputy', '#d4a574', 2, '[]', 'ดูแลด้านการเงินและการบัญชีขององค์กร', 'Oversees company financial and accounting matters'),

-- Department Level
('พัฒนาโครงการ 1', 'Project Development 1', 'department', '#4a7c9b', 1, '["ฝ่ายโครงการ 1", "ฝ่ายโครงการ 7", "ฝ่ายโครงการ 10", "ฝ่ายโครงการ 11", "ฝ่ายสื่อสารองค์กร"]', 'ดูแลการพัฒนาโครงการอสังหาริมทรัพย์กลุ่ม 1', 'Oversees real estate project development group 1'),
('พัฒนาโครงการ 2', 'Project Development 2', 'department', '#4a7c9b', 2, '["ฝ่ายโครงการ 3", "ฝ่ายโครงการ 5", "ฝ่ายโครงการ 6", "ฝ่ายโครงการ 9", "ฝ่ายโครงการ 12"]', 'ดูแลการพัฒนาโครงการอสังหาริมทรัพย์กลุ่ม 2', 'Oversees real estate project development group 2'),
('สายปฏิบัติการ', 'Operations', 'department', '#4a7c9b', 3, '["ฝ่ายพัฒนาธุรกิจ", "ฝ่ายออกแบบ", "ฝ่ายก่อสร้าง", "ฝ่ายอำนวยการ", "ฝ่ายนิติบุคคลฯ", "ฝ่ายบริการฯ", "ฝ่ายที่ดิน", "ฝ่ายกฎหมาย", "สำนักบริหาร"]', 'ดูแลการปฏิบัติงานทั้งหมดขององค์กร', 'Oversees all operational matters'),
('สายสนับสนุน', 'Support', 'department', '#c4d4d8', 4, '["ฝ่ายบัญชี", "ฝ่ายการเงิน", "ฝ่ายเทคโนโลยีและสารสนเทศ", "ฝ่ายนักลงทุนสัมพันธ์และการพัฒนาอย่างยั่งยืน", "ฝ่ายทรัพยากรบุคคล", "ฝ่ายธุรการจัดซื้อ"]', 'ดูแลงานสนับสนุนและบริหาร', 'Oversees support and administrative functions'),
('ฝ่ายตรวจสอบภายในและพัฒนาระบบ', 'Internal Audit & System Development', 'department', '#e8e8e8', 5, '[]', 'ตรวจสอบภายในและพัฒนาระบบงาน', 'Internal audit and system development');