import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  cn: "Simplified Chinese (简体中文)",
  kr: "Korean (한국어)",
  jp: "Japanese (日本語)",
  ru: "Russian (Русский)",
  th: "Thai (ไทย)",
};

async function sha1(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, target_lang } = await req.json();

    if (!Array.isArray(texts) || !target_lang || !LANG_NAMES[target_lang]) {
      return new Response(
        JSON.stringify({ error: "Invalid input. Expected { texts: string[], target_lang }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanTexts = texts
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.trim());

    if (cleanTexts.length === 0) {
      return new Response(JSON.stringify({ translations: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Compute hashes & check cache
    const hashes = await Promise.all(cleanTexts.map(sha1));
    const hashToText = new Map<string, string>();
    cleanTexts.forEach((t, i) => hashToText.set(hashes[i], t));

    const { data: cached } = await supabase
      .from("translations_cache")
      .select("source_hash, translated_text")
      .in("source_hash", hashes)
      .eq("target_lang", target_lang);

    const cachedMap = new Map<string, string>();
    (cached ?? []).forEach((row: { source_hash: string; translated_text: string }) =>
      cachedMap.set(row.source_hash, row.translated_text)
    );

    // 2. Build result + figure out misses
    const result: Record<string, string> = {};
    const missTexts: string[] = [];
    const missHashes: string[] = [];

    cleanTexts.forEach((text, i) => {
      const h = hashes[i];
      const hit = cachedMap.get(h);
      if (hit) {
        result[text] = hit;
      } else {
        missTexts.push(text);
        missHashes.push(h);
      }
    });

    // 3. Translate misses via Lovable AI
    if (missTexts.length > 0) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const langName = LANG_NAMES[target_lang];
      const systemPrompt = `You are a professional translator for a luxury Thai corporate real-estate website (JW Group).
Translate each item from Thai to ${langName}.
Preserve brand names (JW Group, JW Real Estates, etc.) in English.
Preserve numbers, dates, and proper nouns.
Keep the same tone: professional, premium, corporate.
Return ONLY a JSON object mapping the source text to its translation. No commentary.`;

      const userPrompt = `Translate the following ${missTexts.length} items to ${langName}. Return a JSON object where each key is the EXACT source text and the value is the translation:\n\n${JSON.stringify(missTexts)}`;

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!aiRes.ok) {
        if (aiRes.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit. Please retry shortly.", translations: result }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiRes.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted.", translations: result }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errText = await aiRes.text();
        console.error("AI gateway error:", aiRes.status, errText);
        return new Response(
          JSON.stringify({ error: "AI gateway error", translations: result }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content ?? "{}";

      let parsed: Record<string, string> = {};
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse AI JSON:", content);
      }

      // 4. Insert into cache + add to result
      const rowsToInsert: Array<{
        source_hash: string;
        source_text: string;
        target_lang: string;
        translated_text: string;
      }> = [];

      missTexts.forEach((text, i) => {
        const translated = parsed[text];
        if (typeof translated === "string" && translated.trim().length > 0) {
          result[text] = translated;
          rowsToInsert.push({
            source_hash: missHashes[i],
            source_text: text,
            target_lang,
            translated_text: translated,
          });
        } else {
          // Fallback: keep original
          result[text] = text;
        }
      });

      if (rowsToInsert.length > 0) {
        const { error: insErr } = await supabase
          .from("translations_cache")
          .upsert(rowsToInsert, { onConflict: "source_hash,target_lang", ignoreDuplicates: true });
        if (insErr) console.error("Cache insert error:", insErr);
      }
    }

    return new Response(JSON.stringify({ translations: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
