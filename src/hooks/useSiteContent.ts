import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface SiteContent {
  id: string;
  section_key: string;
  title_th: string | null;
  title_en: string | null;
  title_cn: string | null;
  content_th: string | null;
  content_en: string | null;
  content_cn: string | null;
  metadata: unknown;
}

interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
}

export const useSiteContent = () => {
  const { i18n } = useTranslation();
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const [contentRes, imageRes] = await Promise.all([
        supabase.from('site_content').select('*'),
        supabase.from('site_images').select('*')
      ]);

      if (contentRes.data) setContents(contentRes.data);
      if (imageRes.data) setImages(imageRes.data);
    } catch (error) {
      console.error('Error fetching site content:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Helper to get content by section key
  const getContent = useCallback((sectionKey: string) => {
    const content = contents.find(c => c.section_key === sectionKey);
    if (!content) return { title: '', content: '', metadata: null };

    const lang = i18n.language;
    let title = '';
    let contentText = '';

    switch (lang) {
      case 'en':
        title = content.title_en || content.title_th || '';
        contentText = content.content_en || content.content_th || '';
        break;
      case 'cn':
        title = content.title_cn || content.title_th || '';
        contentText = content.content_cn || content.content_th || '';
        break;
      default:
        title = content.title_th || '';
        contentText = content.content_th || '';
    }

    return { title, content: contentText, metadata: content.metadata };
  }, [contents, i18n.language]);

  // Helper to get image by section key
  const getImage = useCallback((sectionKey: string) => {
    const image = images.find(i => i.section_key === sectionKey);
    return image ? { url: image.image_url, alt: image.alt_text || '' } : null;
  }, [images]);

  // Get contents by category from metadata
  const getContentsByCategory = useCallback((category: string) => {
    return contents.filter(c => {
      const metadata = c.metadata as Record<string, unknown> | null;
      return metadata?.category === category;
    });
  }, [contents]);

  return {
    contents,
    images,
    isLoading,
    getContent,
    getImage,
    getContentsByCategory,
    refetch: fetchContent
  };
};
