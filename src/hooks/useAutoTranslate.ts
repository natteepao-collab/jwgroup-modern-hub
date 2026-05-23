import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

/**
 * Auto-translate Thai source texts into the current UI language using the
 * `translate-content` edge function (cached in `translations_cache`).
 *
 * - If current language is 'th' or unsupported, returns originals unchanged.
 * - Batches all unique non-empty strings into a single network call.
 * - Returns a stable map: { [originalThaiText]: translatedText }.
 *
 * Usage:
 *   const { tr, isLoading } = useAutoTranslate([news.title_th, news.excerpt_th]);
 *   <h2>{tr(news.title_th)}</h2>
 */
export function useAutoTranslate(texts: Array<string | null | undefined>) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Stable key for the input set
  const cleaned = useMemo(() => {
    const set = new Set<string>();
    texts.forEach((t) => {
      if (typeof t === "string" && t.trim().length > 0) set.add(t.trim());
    });
    return Array.from(set);
  }, [JSON.stringify(texts)]); // eslint-disable-line react-hooks/exhaustive-deps

  const [map, setMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only translate for non-Thai supported targets
    if (!lang || lang === "th" || cleaned.length === 0) {
      setMap({});
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    supabase.functions
      .invoke("translate-content", {
        body: { texts: cleaned, target_lang: lang },
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("translate-content invoke error:", error);
          setMap({});
        } else if (data?.translations) {
          setMap(data.translations as Record<string, string>);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang, cleaned]);

  const tr = (text: string | null | undefined): string => {
    if (!text) return "";
    if (lang === "th") return text;
    return map[text.trim()] || text;
  };

  return { tr, isLoading, lang };
}

/**
 * Picks the best available pre-translated field from a DB row that has
 * *_th / *_en / *_cn columns. Falls back to *_th if the requested language
 * column is missing. Use this when the DB already has manual translations
 * for en/cn but you want consistent fallback.
 */
export function pickMultilingualField<T extends Record<string, unknown>>(
  row: T | null | undefined,
  baseKey: string,
  lang: string
): string {
  if (!row) return "";
  const candidate = row[`${baseKey}_${lang}` as keyof T];
  if (typeof candidate === "string" && candidate.trim().length > 0) return candidate;
  const thai = row[`${baseKey}_th` as keyof T];
  return typeof thai === "string" ? thai : "";
}
