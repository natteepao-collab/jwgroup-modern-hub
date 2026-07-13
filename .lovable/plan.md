# แผนพัฒนา Organization Chart (JW Real Estate)

## เป้าหมาย
สร้างระบบแผนผังองค์กรแบบ Interactive ระดับ Corporate Premium พร้อมระบบจัดการหลังบ้าน แทน slide viewer เดิมในหน้า `/about/structure`

## สิ่งที่จะสร้าง

### 1. Database (Lovable Cloud)
ตาราง `organization_nodes`:
- `id`, `parent_id` (self-ref), `position_th`, `position_en`, `employee_name`
- `department`, `division`, `organization_level` (1-5)
- `relationship_type`: direct | advisory | executive-support
- `status`: active | vacant | pending
- `display_order`, `effective_date`, `is_active`
- RLS: อ่าน public (เฉพาะ active), แก้ไข admin เท่านั้น
- Seed ข้อมูลตามที่ระบุ (CEO, รองประธาน, MD, ที่ปรึกษา, เลขา, ผู้จัดการ 6 ฝ่าย + หน่วยงานย่อย)

### 2. Public Org Chart Page (`/about/structure`)
**Header**: JW GROUP / ผังโครงสร้างองค์กรและผู้บริหาร / Organization Chart & Management / วันที่มีผลบังคับใช้: 1 กรกฎาคม 2569

**Desktop View** (`OrgChartCanvas.tsx`):
- Top-down tree แบบ SVG + HTML cards
- CEO card ใหญ่สุด กึ่งกลางบน (Navy gradient + Gold accent)
- ระดับ 2 ขนาดรอง, ระดับฝ่าย/แผนก uniform
- เส้นทึบ = direct, เส้นประ = advisory/executive-support
- Zoom / Pan / Fit / Reset controls (ใช้ react-zoom-pan-pinch)
- Expand/Collapse ทั้งหมด + toggle รายกิ่ง
- ค้นหา + filter ตามระดับและฝ่าย
- คลิกการ์ด → Side Panel (Sheet) แสดง detail
- Badge "Vacant" / "รอระบุ" สำหรับตำแหน่งไม่มีคน
- ปุ่ม Print / Export PNG (html-to-image) / Export PDF (jspdf)

**Mobile View** (`OrgChartMobile.tsx`):
- Accordion tree จาก CEO ลงล่าง
- แตะเพื่อ expand/collapse
- Breadcrumb แสดง path เมื่อเปิด detail

### 3. Admin Panel (แท็บใหม่ใน `/admin`)
`OrgStructureManagement.tsx`:
- ตารางแบบ tree list (ไม่ใช่ react-flow เพื่อความ simple)
- เพิ่ม/แก้ไข/ลบ/toggle active
- เลือก parent, ระดับ, ประเภทสายงาน, สถานะ
- Drag-drop เรียงลำดับ (dnd-kit — มีอยู่แล้วในโปรเจกต์)
- Validation: กันวนกลับ, กัน parent = self, เตือนหลาย CEO, เตือน active แต่ไม่มีชื่อ

### 4. Design System
- ใช้ token เดิม (Navy `--primary`, Orange `--accent`) + เพิ่ม Gold accent สำหรับ CEO card
- การ์ดทั้งหมด: rounded-2xl, subtle shadow, hover lift 2px
- ห้าม hardcode สี — ใช้ semantic tokens

## ไฟล์ที่จะเปลี่ยน/สร้าง
- **สร้าง**: `src/components/org/OrgChartCanvas.tsx`, `OrgChartMobile.tsx`, `OrgNodeCard.tsx`, `OrgDetailPanel.tsx`, `OrgToolbar.tsx`, `useOrgTree.ts`, `src/components/admin/OrgStructureManagement.tsx`
- **แก้**: `src/pages/About.tsx` (route `/about/structure` ใช้ chart ใหม่แทน `InteractiveOrgChart`), `src/pages/Admin.tsx` (เพิ่มแท็บ)
- **Migration**: สร้างตาราง `organization_nodes` + seed data
- **Dependencies**: เพิ่ม `react-zoom-pan-pinch`, `html-to-image`, `jspdf`

## ขั้นตอน (สั่งเมื่อ approve)
1. Migration + seed
2. เพิ่ม deps
3. สร้าง hooks + components chart
4. Integrate ในหน้า About
5. สร้าง Admin management
6. ทดสอบด้วย Playwright (screenshot desktop + mobile)

## หมายเหตุ
- ตาราง `org_departments` เดิมเก็บไว้ (ใช้กับส่วนอื่น) — เราสร้างตารางใหม่แยกเพื่อโครงสร้างลำดับชั้นเต็มรูป
- Interactive slide viewer เดิม (`InteractiveOrgChart`) ยังคงเก็บไว้ ไม่ลบ เผื่อ rollback
