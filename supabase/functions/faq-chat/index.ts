import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60000;

const cleanupRateLimitMap = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now >= value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
};

setInterval(cleanupRateLimitMap, 5 * 60 * 1000);

const BASE_SYSTEM_PROMPT = `คุณคือผู้ช่วย FAQ ของ JW Group บริษัทชั้นนำในประเทศไทยที่มีธุรกิจหลากหลาย ตอบคำถามเป็นภาษาไทยอย่างสุภาพ กระชับ และเป็นมิตร

═══════════════════════════════════════
📍 ข้อมูลบริษัท JW GROUP
═══════════════════════════════════════

🏢 JW REAL ESTATES - อสังหาริมทรัพย์ระดับพรีเมียม
• โครงการบ้านเดี่ยว: เริ่มต้น 5-15 ล้านบาท
• ทาวน์โฮม: เริ่มต้น 3-8 ล้านบาท  
• คอนโดมิเนียม: เริ่มต้น 2-10 ล้านบาท
• โฮมออฟฟิศ: เริ่มต้น 8-20 ล้านบาท
• ทำเลทอง: รามอินทรา, ลาดพร้าว, บางนา, พระราม 9
• จุดเด่น: ดีไซน์ทันสมัย, วัสดุคุณภาพสูง, พื้นที่สีเขียว

🏨 12 THE RESIDENCE HOTEL - โรงแรมบูติกหรูหรา
• ห้องพักประเภท:
  - Deluxe Room: 2,500 บาท/คืน
  - Superior Room: 3,500 บาท/คืน  
  - Executive Suite: 5,500 บาท/คืน
  - Presidential Suite: 12,000 บาท/คืน
• สิ่งอำนวยความสะดวก: สระว่ายน้ำ, ฟิตเนส, สปา, ห้องประชุม, ร้านอาหาร
• บริการพิเศษ: Airport Transfer, Room Service 24 ชม., Concierge
• เช็คอิน: 14:00 น. / เช็คเอาท์: 12:00 น.
• เว็บไซต์: https://12theresidence.com

🐾 3DPET HOSPITAL & HOTEL - โรงพยาบาลและโรงแรมสัตว์เลี้ยง
• บริการโรงพยาบาล:
  - ตรวจสุขภาพทั่วไป: 500-1,500 บาท
  - วัคซีน: 300-800 บาท/เข็ม
  - ทำหมัน: 3,000-8,000 บาท (ขึ้นอยู่กับขนาด)
  - ผ่าตัด: ประเมินตามอาการ
  - ทำฟัน/ขูดหินปูน: 2,000-5,000 บาท
• บริการโรงแรมสัตว์เลี้ยง:
  - ห้องพักสุนัข: 500-1,500 บาท/คืน
  - ห้องพักแมว: 400-800 บาท/คืน
  - บริการอาบน้ำตัดขน: 300-1,500 บาท
• เปิดให้บริการ: 24 ชั่วโมง (ฉุกเฉิน)
• เว็บไซต์: https://www.3dpethospital.com

🌿 JW HERBAL & WELLNESS - ผลิตภัณฑ์สมุนไพรและสุขภาพ
• ผลิตภัณฑ์ VFLOW:
  - อาหารเสริมบำรุงสุขภาพ: 590-1,990 บาท
  - ผลิตภัณฑ์ดูแลผิว: 490-1,590 บาท
  - ชาสมุนไพร: 190-490 บาท
  - น้ำมันนวด/สมุนไพร: 290-890 บาท
• จุดเด่น: ผลิตจากสมุนไพรธรรมชาติ 100%, ได้รับมาตรฐาน อย.
• เว็บไซต์: https://jwherbal-roots-and-remedies.lovable.app

═══════════════════════════════════════
❓ คำถามที่พบบ่อย (FAQ)
═══════════════════════════════════════
1. JW Group ทำธุรกิจอะไรบ้าง? → 4 ธุรกิจหลัก: อสังหาริมทรัพย์, โรงแรม, สัตวแพทย์, สุขภาพ
2. นัดชมโครงการบ้านได้อย่างไร? → โทรหาเราหรือกรอกฟอร์มบนเว็บไซต์
3. จองห้องพักโรงแรมได้ที่ไหน? → จองผ่าน 12theresidence.com
4. โรงพยาบาลสัตว์เปิดกี่โมง? → เปิด 24 ชม. สำหรับกรณีฉุกเฉิน
5. มีโปรโมชั่นพิเศษไหม? → ติดตามได้ที่ Facebook และ LINE Official
6. ผ่อนบ้านได้ไหม? → มีโปรแกรมผ่อนชำระกับธนาคารพันธมิตร ดาวน์เริ่มต้น 5%
7. รับบัตรเครดิตไหม? → รับทุกบริการ รวมถึง QR Payment

ถ้าไม่ทราบคำตอบ ให้แนะนำติดต่อเบอร์โทรหรืออีเมลแทน`;

// Types for database records
interface NewsRecord {
  title_th: string;
  excerpt_th: string | null;
  content_th: string | null;
  category: string;
  business_type: string | null;
  published_at: string;
}

interface JobRecord {
  title_th: string;
  department_th: string | null;
  location_th: string | null;
  job_type: string | null;
  description_th: string | null;
  requirements_th: string | null;
}

interface ContactRecord {
  section_key: string;
  content_th: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// Initialize Supabase client
function getSupabaseClient(): AnySupabaseClient | null {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials not configured");
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Function to fetch news from database
async function fetchLatestNews(supabase: AnySupabaseClient): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('title_th, excerpt_th, content_th, category, business_type, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching news:", error);
      return "";
    }

    const news = data as NewsRecord[] | null;
    if (!news || news.length === 0) {
      return "";
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getCategoryName = (category: string) => {
      const categories: Record<string, string> = {
        'company': 'ข่าวบริษัท',
        'press': 'ข่าวประชาสัมพันธ์',
        'csr': 'กิจกรรม CSR',
        'all': 'ข่าวทั่วไป'
      };
      return categories[category] || 'ข่าวทั่วไป';
    };

    const newsContent = news.map((item, index) => {
      const excerpt = item.excerpt_th || (item.content_th ? item.content_th.substring(0, 150) + '...' : '');
      return `${index + 1}. 📰 ${item.title_th}
   📅 ${formatDate(item.published_at)} | 🏷️ ${getCategoryName(item.category)}
   📝 ${excerpt}`;
    }).join('\n\n');

    return `

═══════════════════════════════════════
📰 ข่าวสารล่าสุดของบริษัท
═══════════════════════════════════════
${newsContent}

📌 อ่านข่าวฉบับเต็มได้ที่หน้า "ข่าวสาร" บนเว็บไซต์`;
  } catch (error) {
    console.error("Error in fetchLatestNews:", error);
    return "";
  }
}

// Function to fetch job listings from database
async function fetchJobListings(supabase: AnySupabaseClient): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('title_th, department_th, location_th, job_type, description_th, requirements_th')
      .eq('is_published', true)
      .order('position_order', { ascending: true });

    if (error) {
      console.error("Error fetching jobs:", error);
      return "";
    }

    const jobs = data as JobRecord[] | null;
    if (!jobs || jobs.length === 0) {
      return `

═══════════════════════════════════════
💼 ร่วมงานกับเรา
═══════════════════════════════════════
ขณะนี้ยังไม่มีตำแหน่งงานว่าง แต่สามารถฝากประวัติไว้ได้ที่หน้า "ร่วมงานกับเรา" บนเว็บไซต์
เราจะติดต่อกลับเมื่อมีตำแหน่งที่เหมาะสม`;
    }

    const getJobType = (type: string | null) => {
      const types: Record<string, string> = {
        'full-time': 'พนักงานประจำ',
        'part-time': 'พนักงานพาร์ทไทม์',
        'contract': 'สัญญาจ้าง',
        'internship': 'ฝึกงาน'
      };
      return types[type || ''] || 'พนักงานประจำ';
    };

    const jobsContent = jobs.map((job, index) => {
      const requirements = job.requirements_th ? `\n   📋 คุณสมบัติ: ${job.requirements_th.substring(0, 100)}...` : '';
      return `${index + 1}. 💼 ${job.title_th}
   🏢 แผนก: ${job.department_th || 'ไม่ระบุ'}
   📍 สถานที่: ${job.location_th || 'กรุงเทพฯ'}
   ⏰ ประเภท: ${getJobType(job.job_type)}${requirements}`;
    }).join('\n\n');

    return `

═══════════════════════════════════════
💼 ตำแหน่งงานว่าง (${jobs.length} ตำแหน่ง)
═══════════════════════════════════════
${jobsContent}

📌 วิธีการสมัคร:
• เข้าไปที่หน้า "ร่วมงานกับเรา" บนเว็บไซต์
• เลือกตำแหน่งที่สนใจและกดปุ่ม "สมัครงาน"
• กรอกข้อมูลและแนบ Resume (PDF หรือ Word)
• ฝ่ายบุคคลจะติดต่อกลับภายใน 3-5 วันทำการ`;
  } catch (error) {
    console.error("Error in fetchJobListings:", error);
    return "";
  }
}

// Function to fetch contact information from database
async function fetchContactInfo(supabase: AnySupabaseClient): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('section_key, content_th')
      .in('section_key', ['contact_address', 'contact_phone', 'contact_email', 'contact_hours']);

    if (error) {
      console.error("Error fetching contact info:", error);
      return getDefaultContactInfo();
    }

    const contactData = data as ContactRecord[] | null;
    if (!contactData || contactData.length === 0) {
      return getDefaultContactInfo();
    }

    const contactMap: Record<string, string> = {};
    contactData.forEach(item => {
      contactMap[item.section_key] = item.content_th || '';
    });

    const address = contactMap['contact_address'] || '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110';
    const phone = contactMap['contact_phone'] || '02-234-5678';
    const email = contactMap['contact_email'] || 'info@jwgroup.com';
    const hours = contactMap['contact_hours'] || 'จันทร์-ศุกร์ 9:00-18:00 น.';

    return `

═══════════════════════════════════════
📞 ข้อมูลติดต่อ
═══════════════════════════════════════
🏢 สำนักงานใหญ่: ${address}
📞 โทรศัพท์: ${phone}
📧 อีเมล: ${email}
🕐 เวลาทำการ: ${hours}

🌐 ช่องทางออนไลน์:
• Facebook: JW Group Thailand
• LINE Official: @jwgroup
• เว็บไซต์: jwgroup.com

📌 สามารถส่งข้อความผ่านแบบฟอร์มติดต่อบนเว็บไซต์ได้ที่หน้า "ติดต่อเรา"`;
  } catch (error) {
    console.error("Error in fetchContactInfo:", error);
    return getDefaultContactInfo();
  }
}

function getDefaultContactInfo(): string {
  return `

═══════════════════════════════════════
📞 ข้อมูลติดต่อ
═══════════════════════════════════════
🏢 สำนักงานใหญ่: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
📞 โทรศัพท์: 02-234-5678
📧 อีเมล: info@jwgroup.com
🕐 เวลาทำการ: จันทร์-ศุกร์ 9:00-18:00 น.

🌐 ช่องทางออนไลน์:
• Facebook: JW Group Thailand
• LINE Official: @jwgroup

📌 สามารถส่งข้อความผ่านแบบฟอร์มติดต่อบนเว็บไซต์ได้ที่หน้า "ติดต่อเรา"`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const now = Date.now();
    const userLimit = rateLimitMap.get(clientIP);
    
    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= RATE_LIMIT) {
          console.log(`Rate limit exceeded for IP: ${clientIP}`);
          return new Response(
            JSON.stringify({ error: "คุณส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" }),
            { 
              status: 429, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
        userLimit.count++;
      } else {
        userLimit.count = 1;
        userLimit.resetTime = now + WINDOW_MS;
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = getSupabaseClient();
    let dynamicContext = "";

    if (supabase) {
      const [newsContext, jobsContext, contactContext] = await Promise.all([
        fetchLatestNews(supabase),
        fetchJobListings(supabase),
        fetchContactInfo(supabase)
      ]);

      dynamicContext = newsContext + jobsContext + contactContext;
      console.log("Dynamic context loaded - News:", !!newsContext, "Jobs:", !!jobsContext, "Contact:", !!contactContext);
    } else {
      dynamicContext = getDefaultContactInfo();
    }

    const fullSystemPrompt = BASE_SYSTEM_PROMPT + dynamicContext;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: fullSystemPrompt },
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
