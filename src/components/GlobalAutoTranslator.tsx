import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global DOM-based auto-translator.
 *
 * Scans the document for text nodes containing Thai characters and, when the
 * current UI language is not Thai, calls the `translate-content` edge function
 * to replace them with the user's language. Original text is preserved on the
 * node via a WeakMap so we can switch back instantly when the user returns to
 * Thai or another language we have cached.
 *
 * This handles all hardcoded Thai strings across the app without needing to
 * wrap each component manually.
 */

const THAI_RE = /[\u0E00-\u0E7F]/;
const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'INPUT', 'SVG', 'PATH',
]);

// node -> original Thai text
const originals = new WeakMap<Text, string>();
// cache per language: original -> translated
const cache: Record<string, Map<string, string>> = {};
// in-flight requests dedupe
const inflight: Record<string, Set<string>> = {};

function collectThaiNodes(root: Node): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue;
      if (!text || !THAI_RE.test(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

async function fetchTranslations(texts: string[], lang: string): Promise<Record<string, string>> {
  if (texts.length === 0) return {};
  try {
    const { data, error } = await supabase.functions.invoke('translate-content', {
      body: { texts, target_lang: lang },
    });
    if (error) {
      console.error('[GlobalAutoTranslator] invoke error', error);
      return {};
    }
    return (data?.translations as Record<string, string>) || {};
  } catch (e) {
    console.error('[GlobalAutoTranslator] fetch failed', e);
    return {};
  }
}

export const GlobalAutoTranslator = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    // Reset any in-progress translation to originals when language switches.
    // Then process new language.
    let cancelled = false;
    const scheduled = new Set<Text>();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const ensureCache = (l: string) => {
      if (!cache[l]) cache[l] = new Map();
      if (!inflight[l]) inflight[l] = new Set();
    };

    const applyToNode = (node: Text, l: string) => {
      const original = originals.get(node);
      if (!original) return;
      if (l === 'th') {
        if (node.nodeValue !== original) node.nodeValue = original;
        return;
      }
      const c = cache[l];
      const translated = c?.get(original);
      if (translated && node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    };

    const processBatch = async () => {
      timer = null;
      if (cancelled) return;
      const l = langRef.current;
      ensureCache(l);

      // First snapshot originals for any new nodes
      const nodes = Array.from(scheduled);
      scheduled.clear();
      for (const node of nodes) {
        if (!originals.has(node) && node.nodeValue) {
          originals.set(node, node.nodeValue);
        }
      }

      if (l === 'th') {
        // Restore originals
        for (const node of nodes) applyToNode(node, l);
        return;
      }

      // Collect texts that need fetching
      const c = cache[l];
      const need: string[] = [];
      const nodesByText = new Map<string, Text[]>();
      for (const node of nodes) {
        const original = originals.get(node);
        if (!original) continue;
        if (c.has(original)) {
          applyToNode(node, l);
          continue;
        }
        if (!nodesByText.has(original)) nodesByText.set(original, []);
        nodesByText.get(original)!.push(node);
        if (!inflight[l].has(original)) {
          inflight[l].add(original);
          need.push(original);
        }
      }

      if (need.length === 0) {
        // All already inflight — still apply once fetch resolves; nothing else to do.
        // Re-scan shortly to pick up resolutions.
        return;
      }

      const translations = await fetchTranslations(need, l);
      if (cancelled || langRef.current !== l) return;

      for (const t of need) {
        const tr = translations[t] || t;
        c.set(t, tr);
        inflight[l].delete(t);
      }

      // Apply to all nodes that have a known original now
      const allNodes = collectThaiNodes(document.body);
      for (const node of allNodes) {
        if (!originals.has(node) && node.nodeValue) {
          originals.set(node, node.nodeValue);
        }
        applyToNode(node, l);
      }
    };

    const schedule = (node: Text) => {
      scheduled.add(node);
      if (timer) return;
      timer = setTimeout(processBatch, 80);
    };

    // Initial pass: collect every Thai text node and remember originals.
    const all = collectThaiNodes(document.body);
    for (const node of all) {
      if (!originals.has(node) && node.nodeValue) {
        originals.set(node, node.nodeValue);
      }
      if (lang === 'th') {
        applyToNode(node, 'th');
      } else {
        schedule(node);
      }
    }

    // Watch for new text nodes (route changes, dynamic content).
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // Newly added subtrees
        m.addedNodes.forEach((added) => {
          if (added.nodeType === Node.TEXT_NODE) {
            const t = added as Text;
            const parent = t.parentElement;
            if (!parent || SKIP_TAGS.has(parent.tagName)) return;
            if (t.nodeValue && THAI_RE.test(t.nodeValue)) schedule(t);
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            const nodes = collectThaiNodes(added);
            nodes.forEach(schedule);
          }
        });
        // Character data changes
        if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
          const t = m.target as Text;
          if (t.nodeValue && THAI_RE.test(t.nodeValue)) {
            // If our translator wrote this value, ignore (it matches cache)
            const original = originals.get(t);
            const l = langRef.current;
            if (l !== 'th' && original && cache[l]?.get(original) === t.nodeValue) return;
            // Otherwise treat current value as new original
            originals.set(t, t.nodeValue);
            schedule(t);
          }
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [lang]);

  return null;
};

export default GlobalAutoTranslator;
