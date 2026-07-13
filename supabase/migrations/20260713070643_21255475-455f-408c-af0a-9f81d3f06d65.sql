
-- 1. Enums
DO $$ BEGIN
  CREATE TYPE public.org_relationship_type AS ENUM ('direct', 'advisory', 'executive-support');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.org_node_status AS ENUM ('active', 'vacant', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Table
CREATE TABLE public.organization_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.organization_nodes(id) ON DELETE SET NULL,
  position_th text NOT NULL,
  position_en text,
  employee_name text,
  department text,
  division text,
  organization_level int NOT NULL DEFAULT 3,
  relationship_type public.org_relationship_type NOT NULL DEFAULT 'direct',
  status public.org_node_status NOT NULL DEFAULT 'active',
  display_order int NOT NULL DEFAULT 0,
  effective_date date NOT NULL DEFAULT '2026-07-01',
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_nodes_parent ON public.organization_nodes(parent_id);
CREATE INDEX idx_org_nodes_level ON public.organization_nodes(organization_level);

-- 3. GRANTs
GRANT SELECT ON public.organization_nodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_nodes TO authenticated;
GRANT ALL ON public.organization_nodes TO service_role;

-- 4. RLS
ALTER TABLE public.organization_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active org nodes"
  ON public.organization_nodes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all org nodes"
  ON public.organization_nodes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert org nodes"
  ON public.organization_nodes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update org nodes"
  ON public.organization_nodes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete org nodes"
  ON public.organization_nodes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. updated_at trigger
CREATE TRIGGER update_organization_nodes_updated_at
  BEFORE UPDATE ON public.organization_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Prevent self-parent + basic cycle guard
CREATE OR REPLACE FUNCTION public.prevent_org_cycles()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  cur uuid;
  depth int := 0;
BEGIN
  IF NEW.parent_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.parent_id = NEW.id THEN
    RAISE EXCEPTION 'A node cannot be its own parent';
  END IF;
  cur := NEW.parent_id;
  WHILE cur IS NOT NULL AND depth < 20 LOOP
    IF cur = NEW.id THEN
      RAISE EXCEPTION 'Cycle detected in organization hierarchy';
    END IF;
    SELECT parent_id INTO cur FROM public.organization_nodes WHERE id = cur;
    depth := depth + 1;
  END LOOP;
  RETURN NEW;
END; $$;

CREATE TRIGGER organization_nodes_no_cycle
  BEFORE INSERT OR UPDATE ON public.organization_nodes
  FOR EACH ROW EXECUTE FUNCTION public.prevent_org_cycles();

-- 7. Seed data (JW Real Estate)
DO $$
DECLARE
  ceo uuid; vc uuid; md uuid; adv uuid; sec uuid;
  pm uuid; sys uuid; mkt uuid; acc uuid; sal uuid; leg uuid; hr uuid;
BEGIN
  -- Level 1
  INSERT INTO public.organization_nodes (position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES ('ประธานกรรมการบริหาร', 'Chief Executive Officer', 'คุณวิสิษฐ กอวรกุล', 1, 'direct', 'active', 1, 'สำนักประธานกรรมการบริหาร')
  RETURNING id INTO ceo;

  -- Level 2
  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (ceo, 'รองประธานกรรมการบริหาร', 'Vice Chairman', 'คุณชาลิสา กอวรกุล', 2, 'direct', 'active', 1, 'สำนักประธานกรรมการบริหาร')
  RETURNING id INTO vc;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (ceo, 'กรรมการผู้จัดการ', 'Managing Director', 'คุณพรณัชชา กอวรกุล', 2, 'direct', 'active', 2, 'สำนักกรรมการผู้จัดการ')
  RETURNING id INTO md;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department, notes)
  VALUES (ceo, 'ที่ปรึกษาอาวุโส', 'Senior Advisor', 'คุณประกอบ เติมเพชร', 2, 'advisory', 'active', 3, 'ที่ปรึกษา', 'สายงานที่ปรึกษา (เส้นประ)')
  RETURNING id INTO adv;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (ceo, 'เลขานุการประธานกรรมการ', 'Secretary to Chairman', 'คุณเมทิกา ตะเวทีกุล', 2, 'executive-support', 'active', 4, 'สำนักประธานกรรมการบริหาร')
  RETURNING id INTO sec;

  -- Level 3: ฝ่ายหลัก (under MD)
  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ผู้จัดการโครงการ', 'Project Manager', 'คุณปิยะเดช ช้างระดม', 3, 'direct', 'active', 1, 'ฝ่ายโครงการ')
  RETURNING id INTO pm;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ฝ่ายผลิตงานระบบ', 'System Production Department', NULL, 3, 'direct', 'pending', 2, 'ฝ่ายผลิตงานระบบ')
  RETURNING id INTO sys;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'หัวหน้าฝ่ายการตลาด', 'Head of Marketing', NULL, 3, 'direct', 'vacant', 3, 'ฝ่ายการตลาด')
  RETURNING id INTO mkt;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ผู้จัดการฝ่ายบัญชีและการเงิน', 'Accounting & Finance Manager', 'คุณเนตร ทองจันทร์', 3, 'direct', 'active', 4, 'ฝ่ายบัญชีและการเงิน')
  RETURNING id INTO acc;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ผู้จัดการฝ่ายขาย', 'Sales Manager', 'คุณพันธ์ศักดิ์ จันทพัฒน์', 3, 'direct', 'active', 5, 'ฝ่ายขาย')
  RETURNING id INTO sal;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ผู้จัดการฝ่ายกฎหมาย', 'Legal Manager', 'คุณนรณัษฐ์ ศุภโชคเกษมสันต์', 3, 'direct', 'active', 6, 'ฝ่ายกฎหมาย')
  RETURNING id INTO leg;

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department)
  VALUES (md, 'ผู้จัดการฝ่ายทรัพยากรบุคคล', 'Human Resources Manager', 'คุณกรอร ฤทธิ์คำรพ', 3, 'direct', 'active', 7, 'ฝ่ายทรัพยากรบุคคล')
  RETURNING id INTO hr;

  -- Level 4: หน่วยงานย่อย
  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department, division)
  VALUES (pm, 'หัวหน้าแผนกสถาปัตยกรรมและการออกแบบ', 'Head of Architecture & Design', 'คุณกิตติพัฒน์ จันทร์แจ่มแจ้ง', 4, 'direct', 'active', 1, 'ฝ่ายโครงการ', 'แผนกสถาปัตยกรรมและการออกแบบ');

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department, division)
  VALUES (acc, 'ผู้ช่วยผู้จัดการฝ่ายบัญชีและการเงิน', 'Assistant Manager, Accounting & Finance', 'คุณสมหญิง เซียวสธนกุล', 4, 'direct', 'active', 1, 'ฝ่ายบัญชีและการเงิน', NULL);

  INSERT INTO public.organization_nodes (parent_id, position_th, position_en, employee_name, organization_level, relationship_type, status, display_order, department, division)
  VALUES (acc, 'หัวหน้าแผนกจัดซื้อ', 'Head of Procurement', 'คุณนิชานันท์ สุขโภคกิจ', 4, 'direct', 'active', 2, 'ฝ่ายบัญชีและการเงิน', 'แผนกจัดซื้อ');
END $$;
