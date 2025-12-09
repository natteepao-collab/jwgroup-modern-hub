import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `คุณคือผู้ช่วย FAQ ของ JW Group บริษัทชั้นนำในประเทศไทยที่มีธุรกิจหลากหลาย

ข้อมูลบริษัท JW Group:
- JW Real Estates: ธุรกิจอสังหาริมทรัพย์ระดับพรีเมียม พัฒนาโครงการที่พักอาศัยและพาณิชย์คุณภาพสูง
- 12 The Residence Hotel: โรงแรมบูติกหรูหรา ให้บริการระดับโลก พร้อมสิ่งอำนวยความสะดวกครบครัน
- 3DPet Hospital & Hotel: โรงพยาบาลสัตว์และโรงแรมสัตว์เลี้ยงที่ทันสมัย ดูแลสัตว์เลี้ยงด้วยมาตรฐานสูงสุด
- JW Herbal & Wellness: ผลิตภัณฑ์สมุนไพรและสุขภาพคุณภาพสูง

ข้อมูลติดต่อ:
- ที่อยู่: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
- เวลาทำการ: จันทร์ - ศุกร์ 9:00 - 18:00 น.
- โทร: 02-234-5678
- อีเมล: info@jwgroup.com

คำถามที่พบบ่อย:
1. JW Group ทำธุรกิจอะไรบ้าง? - เรามี 4 ธุรกิจหลัก: อสังหาริมทรัพย์, โรงแรม, สัตวแพทย์, และสุขภาพ
2. ติดต่อบริษัทได้อย่างไร? - โทร 02-234-5678 หรืออีเมล info@jwgroup.com
3. เปิดทำการวันไหนบ้าง? - จันทร์-ศุกร์ 9:00-18:00 น.
4. มีตำแหน่งงานว่างไหม? - ดูตำแหน่งงานได้ที่หน้า "ร่วมงานกับเรา"
5. โรงพยาบาลสัตว์เปิดกี่โมง? - 3DPet เปิดให้บริการ 24 ชั่วโมง

ตอบคำถามเป็นภาษาไทยอย่างสุภาพ กระชับ และเป็นมิตร ถ้าไม่ทราบคำตอบให้แนะนำติดต่อเบอร์โทรหรืออีเมลแทน`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "ระบบไม่ว่าง กรุณาลองใหม่อีกครั้ง" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "ระบบไม่พร้อมใช้งาน กรุณาติดต่อเจ้าหน้าที่" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("FAQ chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
