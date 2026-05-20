## Phase 3: Trust & Corporate Credibility

ปรับ 3 ส่วนหลักให้ดู "เป็นองค์กรน่าเชื่อถือ" ไม่ใช่หน้ารวมข้อมูล

---

### 1. Awards Hub (`/awards` + `AwardsSection.tsx`)

**ปัจจุบัน**: Awards page เป็นแค่ wrapper บาง ๆ แสดง AwardsSection อย่างเดียว

**ปรับใหม่**:
- เพิ่ม Hero header ของหน้า: หัวข้อ "รางวัลและการรับรอง" + คำโปรย + 3 stat tiles (จำนวนรางวัลรวม, จำนวนใบรับรอง, ช่วงปีที่ได้รับ)
- เพิ่ม Filter tabs: ทั้งหมด / รางวัล (award) / ใบรับรอง (certification)
- ปรับการ์ดรางวัลให้แสดง 4 ข้อมูลครบทุกใบ:
  - ปีที่ได้รับ (badge มุมบน)
  - ชื่อรางวัล/ใบรับรอง
  - หน่วยงานที่มอบ (พร้อม icon Building/Award)
  - หมวด (award/certification) เป็น tag สี
- จัดกลุ่มตามปีแบบ section header (2025 → 2023 → 2022) เพื่ออ่านง่าย
- เพิ่ม trust strip ด้านล่าง: "ได้รับการรับรองโดย" + รายชื่อหน่วยงาน

### 2. Timeline Storytelling (`CompanyTimeline.tsx`)

**ปัจจุบัน**: timeline 17 ปี แต่ดูเป็น list เฉย ๆ

**ปรับใหม่**:
- เพิ่ม intro: "เส้นทาง 30+ ปีของ JW Group" + 3 milestone badges (ก่อตั้ง / จุดเปลี่ยน / ปัจจุบัน)
- จัด timeline เป็น "chapters" 3 ช่วง: จุดเริ่มต้น (2536-2549) / เติบโต (2550-2562) / ขยายธุรกิจ (2563-ปัจจุบัน) — มีหัวเรื่องบรรยายสั้น ๆ คั่นแต่ละช่วง
- เน้น highlight years ด้วย card ขนาดใหญ่ขึ้น + ribbon "ก้าวสำคัญ"
- เพิ่ม connector line ที่ชัดเจน + dot ขนาดต่างกันตาม `is_highlight`
- มี "อ่านเรื่องราวเพิ่มเติม" CTA ปลาย timeline ไปหน้า About/History

### 3. Leadership Section (`ChairmanQuote.tsx`)

**ปัจจุบัน**: ประธาน + กรรมการผู้จัดการ + ผู้จัดการ 9 คน แต่มี placeholder "ผู้จัดการใหม่ / ตำแหน่ง" 1 รายการ + ดูเหมือนสไลด์ส่วนตัว

**ปรับใหม่**:
- ลบ/ซ่อน executive ที่ชื่อ "ผู้จัดการใหม่" (placeholder) ผ่าน insert query (set position_order ไกล + ไม่แสดง) — หรือ filter ใน frontend
- ปรับ Chairman card: เพิ่ม credentials line ใต้ชื่อ (ตำแหน่ง + ปีก่อตั้ง/ประสบการณ์) ใช้ typography แบบ editorial (serif quote marks, generous spacing)
- Managing Directors: 2 การ์ดวางคู่กัน เน้น hierarchy ชัดเจน (ไม่ใช่ family tree เล่น ๆ)
- Department Managers: เปลี่ยนจาก "horizontally scrollable cards" เป็น grid ที่นิ่งกว่า + แสดง department badge สีตาม business_type
- โทนสี: ใช้ navy primary + แบ็คกราวด์ off-white/ครีม ลด gradient จัด ๆ ออก เพิ่มความ professional

---

### Technical Notes

**Files to edit:**
- `src/pages/Awards.tsx` — เพิ่ม hero + stats + filter container
- `src/components/AwardsSection.tsx` — group by year, filter tabs, year badge, org icon, certification tag
- `src/components/CompanyTimeline.tsx` — chapter grouping, intro stats, highlight emphasis
- `src/components/ChairmanQuote.tsx` — refined editorial styling, hide placeholder exec, grid manager layout

**Data cleanup (insert tool):**
- `UPDATE executives SET is_chairman = false WHERE name = 'ผู้จัดการใหม่'` + ซ่อน (เพิ่ม filter `name != 'ผู้จัดการใหม่'`)

**ไม่แตะ:**
- DB schema (ข้อมูลครบแล้ว)
- Admin panel
- Routes
- i18n keys หลัก (เพิ่มเฉพาะที่จำเป็น)

ทำต่อเนื่องในรอบเดียว ถ้า approve ครับ
