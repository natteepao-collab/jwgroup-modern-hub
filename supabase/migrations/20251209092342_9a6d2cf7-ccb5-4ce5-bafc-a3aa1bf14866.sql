-- Add department and level fields to executives table for managers
ALTER TABLE public.executives 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'executive';

-- Insert mock managers data
INSERT INTO public.executives (name, title, description, is_chairman, position_order, department, level)
VALUES 
  ('คุณสมชาย วงศ์ไพศาล', 'ผู้จัดการฝ่ายอสังหาริมทรัพย์', 'รับผิดชอบดูแลโครงการพัฒนาอสังหาริมทรัพย์ทั้งหมด', false, 10, 'real_estate', 'manager'),
  ('คุณวิภา สุขสมบูรณ์', 'ผู้จัดการฝ่ายโรงแรม', 'ดูแลการดำเนินงานของ 12 The Residence Hotel', false, 11, 'hotel', 'manager'),
  ('น.สพ. ธนกร เพ็ชรดี', 'ผู้จัดการฝ่ายสัตวแพทย์', 'บริหารจัดการ 3DPet Hospital & Hotel', false, 12, 'veterinary', 'manager'),
  ('คุณนภัสสร ธรรมวิสุทธิ์', 'ผู้จัดการฝ่ายสุขภาพ', 'ดูแลธุรกิจ JW Herbal & Wellness', false, 13, 'wellness', 'manager'),
  ('คุณพิชญา รุ่งโรจน์', 'ผู้จัดการฝ่ายการเงิน', 'ดูแลงานบัญชีและการเงินขององค์กร', false, 14, 'finance', 'manager'),
  ('คุณอรรถพล มั่นคง', 'ผู้จัดการฝ่ายทรัพยากรบุคคล', 'ดูแลการพัฒนาบุคลากรและสวัสดิการ', false, 15, 'hr', 'manager'),
  ('คุณศิริพร ก้าวหน้า', 'ผู้จัดการฝ่ายการตลาด', 'วางแผนและดำเนินกลยุทธ์การตลาด', false, 16, 'marketing', 'manager'),
  ('คุณธีรวัฒน์ พัฒนาการ', 'ผู้จัดการฝ่าย IT', 'ดูแลระบบเทคโนโลยีสารสนเทศ', false, 17, 'it', 'manager')
ON CONFLICT DO NOTHING;