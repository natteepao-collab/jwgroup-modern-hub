import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const WINDOW_MS = 60000;
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitMap.entries()) if (now >= v.resetTime) rateLimitMap.delete(k);
}, 5 * 60 * 1000);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

function getSupabase(): AnySupabaseClient | null {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  return createClient(url, key);
}

const truncate = (s: string | null | undefined, n = 220) =>
  s ? (s.length > n ? s.substring(0, n).replace(/<[^>]+>/g, "") + "…" : s.replace(/<[^>]+>/g, "")) : "";

// Pull a comprehensive knowledge base from the database
async function buildKnowledgeBase(supabase: AnySupabaseClient): Promise<string> {
  const [
    siteContentRes, businessTypesRes, newsRes, jobsRes,
    benefitsRes, awardsRes, projectsRes, testimonialsRes,
    executivesRes, timelineRes, visionRes, orgRes,
  ] = await Promise.all([
    supabase.from("site_content").select("section_key,title_th,content_th,metadata"),
    supabase.from("business_types").select("business_key,name_th,name_en").eq("is_active", true).order("position_order"),
    supabase.from("news").select("title_th,excerpt_th,content_th,category,business_type,published_at")
      .eq("is_published", true).order("published_at", { ascending: false }).limit(20),
    supabase.from("jobs").select("title_th,department_th,location_th,job_type,description_th,requirements_th")
      .eq("is_published", true).order("position_order"),
    supabase.from("career_benefits").select("title_th,description_th").eq("is_published", true).order("position_order"),
    supabase.from("awards").select("title_th,description_th,award_year,awarding_organization,category")
      .eq("is_published", true).order("award_year", { ascending: false }).limit(25),
    supabase.from("projects").select("name_th,description_th,location_th,year_completed,business_type,is_featured")
      .eq("is_published", true).order("position_order").limit(40),
    supabase.from("testimonials").select("client_name,client_title,client_company,content_th,rating")
      .eq("is_published", true).order("position_order").limit(15),
    supabase.from("executives").select("name,title,department,level,is_chairman,quote,description").order("position_order"),
    supabase.from("timeline_events").select("year,title_th,description_th,is_highlight")
      .eq("is_published", true).order("year").limit(50),
    supabase.from("vision_missions").select("business_type,vision_th,vision_sub_th,missions,core_concept")
      .eq("is_published", true).order("position_order"),
    supabase.from("org_departments").select("name_th,description_th,business_type,level,parent_level,sub_items")
      .eq("is_published", true).order("position_order").limit(60),
  ]);

  const sections: string[] = [];

  if (siteContentRes.data?.length) {
    const sc: Record<string, { title?: string; content?: string; metadata?: Record<string, unknown> }> = {};
    for (const r of siteContentRes.data) sc[r.section_key] = { title: r.title_th, content: r.content_th, metadata: r.metadata };

    sections.push(`## เกี่ยวกับ JW GROUP
${sc.about_section?.content || sc.hero?.content || "กลุ่มบริษัท JW Group ครอบคลุมธุรกิจอสังหาริมทรัพย์ โรงแรม โรงพยาบาลสัตว์ สมุนไพร และก่อสร้าง"}

## ติดต่อ
- ที่อยู่: ${sc.contact_address?.content || "123 ถนนสุขุมวิท กรุงเทพฯ 10110"}
- โทร: ${sc.contact_phone?.content || "02-234-5678"}
- อีเมล: ${sc.contact_email?.content || "info@jwgroup.com"}
- เวลาทำการ: ${sc.contact_hours?.content || "จันทร์-ศุกร์ 9:00-18:00 น."}
- ช่องทาง Social: LINE / Facebook / IG / TikTok / YouTube (ดูที่ท้ายเว็บไซต์)`);

    const bizKeys = ["business_realestate", "business_hotel", "business_pet", "business_wellness", "business_construction"];
    const bizBlock = bizKeys
      .map((k) => sc[k] ? `- **${sc[k].title}**: ${truncate(sc[k].content, 260)}` : null)
      .filter(Boolean).join("\n");
    if (bizBlock) sections.push(`## ธุรกิจในเครือ JW Group\n${bizBlock}`);
  }

  if (businessTypesRes.data?.length) {
    sections.push(`## หน่วยธุรกิจหลัก\n${businessTypesRes.data.map(b => `- ${b.name_th}${b.name_en ? ` (${b.name_en})` : ""} — key: ${b.business_key}`).join("\n")}`);
  }

  if (visionRes.data?.length) {
    const vmBlock = visionRes.data.map(v => {
      const missions = Array.isArray(v.missions)
        ? v.missions.slice(0, 3).map((m: { title_th?: string; title?: string }) => m.title_th || m.title).filter(Boolean).join(", ")
        : "";
      return `**${v.business_type}** — วิสัยทัศน์: ${truncate(v.vision_th, 180)}${missions ? `\n  พันธกิจหลัก: ${missions}` : ""}`;
    }).join("\n");
    sections.push(`## วิสัยทัศน์และพันธกิจแต่ละธุรกิจ\n${vmBlock}`);
  }

  if (executivesRes.data?.length) {
    const chairman = executivesRes.data.find((e) => e.is_chairman);
    const md = executivesRes.data.filter((e) => !e.is_chairman && e.level === "managing_director");
    const execs = executivesRes.data.filter((e) => !e.is_chairman && e.level !== "managing_director").slice(0, 12);
    sections.push(`## ผู้บริหารและทีมงาน
${chairman ? `- 👑 **${chairman.name}** — ${chairman.title}${chairman.quote ? ` คำขวัญ: "${truncate(chairman.quote, 140)}"` : ""}` : ""}
${md.map(e => `- 🎯 **${e.name}** — ${e.title}${e.department ? ` (${e.department})` : ""}`).join("\n")}
${execs.map(e => `- ${e.name} — ${e.title}${e.department ? ` (${e.department})` : ""}`).join("\n")}`);
  }

  if (orgRes.data?.length) {
    const byBiz: Record<string, string[]> = {};
    for (const d of orgRes.data) {
      const k = d.business_type || "jw_group";
      if (!byBiz[k]) byBiz[k] = [];
      const subs = Array.isArray(d.sub_items) && d.sub_items.length
        ? ` → ${d.sub_items.slice(0, 4).map((s: { name_th?: string; name?: string } | string) => typeof s === "string" ? s : (s.name_th || s.name)).filter(Boolean).join(", ")}`
        : "";
      byBiz[k].push(`  - ${d.name_th}${subs}`);
    }
    const orgBlock = Object.entries(byBiz).map(([k, arr]) => `**${k}**:\n${arr.slice(0, 12).join("\n")}`).join("\n");
    sections.push(`## โครงสร้างองค์กร / หน่วยงาน\n${orgBlock}`);
  }

  if (timelineRes.data?.length) {
    sections.push(`## ประวัติและเหตุการณ์สำคัญ\n${timelineRes.data.slice(0, 20).map(t => `- ${t.year}: ${t.title_th}${t.description_th ? ` — ${truncate(t.description_th, 120)}` : ""}`).join("\n")}`);
  }

  if (projectsRes.data?.length) {
    const featured = projectsRes.data.filter(p => p.is_featured).slice(0, 6);
    const others = projectsRes.data.filter(p => !p.is_featured).slice(0, 18);
    sections.push(`## โครงการ/ผลงาน (รวม ${projectsRes.data.length} โครงการ)
${featured.length ? `**ไฮไลต์:**\n${featured.map(p => `- ⭐ **${p.name_th}** (${p.business_type})${p.location_th ? ` 📍${p.location_th}` : ""}${p.year_completed ? ` | ${p.year_completed}` : ""}${p.description_th ? `\n   ${truncate(p.description_th, 140)}` : ""}`).join("\n")}\n` : ""}${others.map(p => `- ${p.name_th} (${p.business_type})${p.location_th ? ` 📍${p.location_th}` : ""}${p.year_completed ? ` | ${p.year_completed}` : ""}`).join("\n")}`);
  }

  if (newsRes.data?.length) {
    sections.push(`## ข่าวสารล่าสุด
${newsRes.data.slice(0, 10).map(n => `- 📰 **${n.title_th}** (${new Date(n.published_at).toLocaleDateString("th-TH")}) — ${truncate(n.excerpt_th || n.content_th, 160)}`).join("\n")}`);
  }

  if (jobsRes.data?.length) {
    sections.push(`## ตำแหน่งงานว่าง (${jobsRes.data.length} ตำแหน่ง)
${jobsRes.data.map(j => `- 💼 **${j.title_th}** | ${j.department_th || "-"} | ${j.location_th || "กรุงเทพฯ"} | ${j.job_type || "full-time"}`).join("\n")}
สมัครผ่านหน้า "ร่วมงานกับเรา" บนเว็บไซต์`);
  }

  if (benefitsRes.data?.length) {
    sections.push(`## สวัสดิการพนักงาน\n${benefitsRes.data.map(b => `- ${b.title_th}${b.description_th ? `: ${truncate(b.description_th, 100)}` : ""}`).join("\n")}`);
  }

  if (awardsRes.data?.length) {
    sections.push(`## รางวัลและผลงาน (${awardsRes.data.length} รางวัล)
${awardsRes.data.slice(0, 12).map(a => `- 🏆 ${a.title_th} (${a.award_year || "-"})${a.awarding_organization ? ` โดย ${a.awarding_organization}` : ""}`).join("\n")}`);
  }

  if (testimonialsRes.data?.length) {
    sections.push(`## รีวิวจากลูกค้า
${testimonialsRes.data.slice(0, 6).map(t => `- ⭐${t.rating || 5} **${t.client_name}** (${t.client_title || ""}${t.client_company ? `, ${t.client_company}` : ""}): "${truncate(t.content_th, 140)}"`).join("\n")}`);
  }

  return sections.join("\n\n");
}

// Heuristic topic extraction for marketing analytics
function extractTopics(text: string): string[] {
  const topics: string[] = [];
  const t = text.toLowerCase();
  const map: Record<string, string[]> = {
    "อสังหา": ["บ้าน", "คอนโด", "ทาวน์โฮม", "โครงการ", "อสังหา", "real estate", "townhome"],
    "โรงแรม": ["โรงแรม", "ห้องพัก", "residence", "hotel", "ที่พัก"],
    "สัตวแพทย์": ["หมา", "แมว", "สัตว์", "pet", "3dpet", "วัคซีน", "โรงพยาบาลสัตว์"],
    "สมุนไพร": ["สมุนไพร", "herbal", "wellness", "สุขภาพ", "อาหารเสริม"],
    "ก่อสร้าง": ["ก่อสร้าง", "ธนบูลย์", "thanabul", "รับเหมา"],
    "ราคา": ["ราคา", "เท่าไหร่", "กี่บาท", "ค่า"],
    "สมัครงาน": ["สมัครงาน", "งาน", "ตำแหน่ง", "career", "job"],
    "ติดต่อ": ["ติดต่อ", "เบอร์", "โทร", "อีเมล", "contact"],
    "โปรโมชั่น": ["โปรโมชั่น", "ส่วนลด", "promotion"],
    "นัดชม": ["นัด", "เยี่ยมชม", "ดูโครงการ", "visit"],
  };
  for (const [topic, kws] of Object.entries(map)) if (kws.some(k => t.includes(k))) topics.push(topic);
  return topics;
}

async function logConversation(
  supabase: AnySupabaseClient,
  sessionId: string,
  userMessage: string,
  meta: { userAgent?: string; language?: string; pageUrl?: string; referrer?: string }
) {
  try {
    const topics = extractTopics(userMessage);
    // Upsert conversation
    const { data: existing } = await supabase.from("chat_conversations").select("id,message_count,topics").eq("session_id", sessionId).maybeSingle();
    let conversationId: string;
    if (existing) {
      const mergedTopics = Array.from(new Set([...(existing.topics || []), ...topics]));
      await supabase.from("chat_conversations").update({
        message_count: (existing.message_count || 0) + 1,
        last_user_message: userMessage.substring(0, 500),
        last_activity_at: new Date().toISOString(),
        topics: mergedTopics,
      }).eq("id", existing.id);
      conversationId = existing.id;
    } else {
      const { data: inserted } = await supabase.from("chat_conversations").insert({
        session_id: sessionId,
        user_agent: meta.userAgent?.substring(0, 500),
        language: meta.language || "th",
        page_url: meta.pageUrl?.substring(0, 500),
        referrer: meta.referrer?.substring(0, 500),
        topics,
        message_count: 1,
        last_user_message: userMessage.substring(0, 500),
      }).select("id").single();
      conversationId = inserted!.id;
    }
    await supabase.from("chat_messages").insert({ conversation_id: conversationId, role: "user", content: userMessage });
    return conversationId;
  } catch (e) {
    console.error("logConversation failed:", e);
    return null;
  }
}

async function logAssistantReply(supabase: AnySupabaseClient, conversationId: string, content: string) {
  try {
    await supabase.from("chat_messages").insert({ conversation_id: conversationId, role: "assistant", content });
  } catch (e) {
    console.error("logAssistantReply failed:", e);
  }
}

// Cache knowledge base in module scope (refresh every 5 min)
let cachedKB: { text: string; expiresAt: number } | null = null;
async function getKnowledgeBase(supabase: AnySupabaseClient | null): Promise<string> {
  if (cachedKB && Date.now() < cachedKB.expiresAt) return cachedKB.text;
  if (!supabase) return "";
  const text = await buildKnowledgeBase(supabase);
  cachedKB = { text, expiresAt: Date.now() + 5 * 60 * 1000 };
  return text;
}

const BASE_PROMPT = `คุณคือ "JW Group Assistant" ผู้ช่วย AI อัจฉริยะของกลุ่มบริษัท JW Group
บทบาท: ตอบคำถามลูกค้าเกี่ยวกับสินค้า บริการ โครงการ และข้อมูลบริษัทอย่างถูกต้องและเป็นมิตร

⚡ กฎสำคัญ:
1. ตอบเป็นภาษาเดียวกับที่ลูกค้าใช้ (ไทย/อังกฤษ/จีน) — เริ่มต้นด้วยภาษาไทย
2. ตอบกระชับ 2-4 ประโยค ตรงประเด็น ใช้ markdown bullet ได้
3. ใช้ "ข้อมูลจากระบบ" ด้านล่างเป็นความจริง — อย่าแต่งข้อมูลที่ไม่มี
4. ถ้าไม่มีคำตอบในข้อมูล ให้แนะนำติดต่อทีมงานโดยตรง พร้อมเบอร์/อีเมล
5. หลังตอบ เสนอ 2-3 ตัวเลือกถัดไปเป็น bullet เพื่อชวนคุยต่อ
6. ใช้ emoji พอประมาณ (1-2 ตัวต่อข้อความ)
7. โทนสุภาพ มืออาชีพ น่าเชื่อถือ แต่อบอุ่นเหมือนเพื่อน
8. ถ้าลูกค้าสนใจซื้อ/นัดชม → ขอช่องทางติดต่อกลับ (ชื่อ, เบอร์โทร, LINE ID) เพื่อให้เจ้าหน้าที่ติดต่อกลับ`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const userLimit = rateLimitMap.get(clientIP);
    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= RATE_LIMIT) {
          return new Response(JSON.stringify({ error: "คุณส่งข้อความบ่อยเกินไป กรุณารอสักครู่" }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        userLimit.count++;
      } else { userLimit.count = 1; userLimit.resetTime = now + WINDOW_MS; }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
    }

const BASE_PROMPT = `คุณคือ "JW Group Assistant" ผู้ช่วยอัจฉริยะของกลุ่มบริษัท JW Group
คุณรู้ข้อมูลทุกอย่างเกี่ยวกับบริษัทในเครือ — อสังหาริมทรัพย์, โรงแรม/รีสอร์ท, โรงพยาบาลสัตว์ 3DPet, สมุนไพร Herbal Wellness, และก่อสร้าง Thanabul Property

🎭 บุคลิก: เหมือนพนักงานต้อนรับมืออาชีพที่อบอุ่น เป็นกันเอง พูดคุยเหมือนเพื่อนสนิทแต่ยังคงความสุภาพ ไม่เป็นทางการจัด ไม่หุ่นยนต์

✍️ วิธีตอบ:
1. **ภาษา**: ตอบเป็นภาษาเดียวกับลูกค้า (ไทย/อังกฤษ/จีน/เกาหลี/ญี่ปุ่น/รัสเซีย) อัตโนมัติ
2. **ความยาวพอดี**: คำถามสั้น/ทักทาย → ตอบ 1-2 ประโยค | คำถามทั่วไป → 2-4 ประโยค | คำถามเชิงลึก/รายละเอียดโครงการ → 4-7 ประโยคหรือ bullet สั้นๆ 3-5 ข้อ — **ไม่ยาวเป็นพรืด ไม่สั้นแบบห้วน**
3. **น้ำเสียงเหมือนมนุษย์**: ใช้คำเชื่อมธรรมชาติ ("จริงๆ แล้ว...", "ที่ JW Group เรา...", "บอกตามตรงนะคะ/ครับ"), สลับ "ค่ะ/ครับ" ตามบริบท, หลีกเลี่ยงประโยคซ้ำซากแบบเทมเพลต
4. **ใช้ข้อมูลจริง**: อ้างจาก "ข้อมูลจากระบบ" ด้านล่างเท่านั้น ห้ามแต่ง ตัวเลข ชื่อโครงการ ราคา หรือชื่อบุคคล หากไม่มี
5. **เมื่อไม่รู้**: ยอมรับตรงๆ อย่างเป็นมิตร แล้วเสนอช่องทางติดต่อทีมงาน (โทร/อีเมล/LINE)
6. **Emoji**: ใช้ 0-2 ตัวเท่านั้น และใช้ให้สื่อความหมาย ไม่ใช่ทุกประโยค
7. **เชิญชวนต่อ**: เฉพาะคำถามที่นำไปต่อยอดได้ ค่อยเสนอ 2 ตัวเลือกถัดไปแบบสั้น — ไม่ต้องเสนอทุกครั้ง
8. **Lead capture**: ถ้าลูกค้าแสดงความสนใจซื้อ/นัดชม/ขอใบเสนอราคา ค่อยขอชื่อ + เบอร์ติดต่อ/LINE อย่างเป็นธรรมชาติ
9. **Markdown**: ใช้ **bold** กับชื่อโครงการ/บริษัท, ใช้ bullet เมื่อมีรายการ 3+ ข้อ, อย่าใช้หัวข้อ ## ในคำตอบ`;

    const body = await req.json();
    const { messages: rawMessages, sessionId, language, pageUrl } = body as {
      messages: { role: string; content: string }[];
      sessionId?: string; language?: string; pageUrl?: string;
    };

    // Validate & sanitize messages (prevent role spoofing, cap size)
    const MAX_MESSAGES = 20;
    const ALLOWED_ROLES = new Set(['user', 'assistant']);
    const messages = Array.isArray(rawMessages)
      ? rawMessages
          .filter((m) => m && ALLOWED_ROLES.has(m.role) && typeof m.content === 'string')
          .slice(-MAX_MESSAGES)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      : [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'ไม่มีข้อความที่ถูกต้อง' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = getSupabase();
    const kb = await getKnowledgeBase(supabase);

    // Log inbound user message
    let conversationId: string | null = null;
    if (supabase && sessionId) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";
      if (lastUserMsg) {
        conversationId = await logConversation(supabase, sessionId, lastUserMsg, {
          userAgent: req.headers.get("user-agent") || undefined,
          language, pageUrl,
          referrer: req.headers.get("referer") || undefined,
        });
      }
    }

    const fullSystemPrompt = `${BASE_PROMPT}\n\n═══ ข้อมูลจากระบบ JW Group (real-time) ═══\n${kb}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [{ role: "system", content: fullSystemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "ระบบไม่ว่าง กรุณาลองใหม่อีกครั้ง" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "ระบบไม่พร้อมใช้งาน กรุณาติดต่อเจ้าหน้าที่" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      console.error("AI gateway error:", aiResp.status, await aiResp.text());
      return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Tee the stream: send to client AND capture text for logging
    if (!aiResp.body || !supabase || !conversationId) {
      return new Response(aiResp.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
    }

    const [clientStream, logStream] = aiResp.body.tee();
    // Background log
    (async () => {
      try {
        const reader = logStream.getReader();
        const decoder = new TextDecoder();
        let buf = "", full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 1);
            if (!line.startsWith("data: ")) continue;
            const j = line.slice(6).trim();
            if (j === "[DONE]") continue;
            try {
              const p = JSON.parse(j);
              const c = p.choices?.[0]?.delta?.content;
              if (c) full += c;
            } catch { /* ignore */ }
          }
        }
        if (full && conversationId) await logAssistantReply(supabase, conversationId, full);
      } catch (e) { console.error("stream log error:", e); }
    })();

    return new Response(clientStream, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (error) {
    console.error("FAQ chat error:", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
