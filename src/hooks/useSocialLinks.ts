import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}

const defaultLinks: SocialLinks = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  youtube: 'https://youtube.com'
};

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('section_key, content_th')
        .in('section_key', ['social_facebook', 'social_instagram', 'social_tiktok', 'social_youtube']);

      if (error) throw error;

      const newLinks: SocialLinks = { ...defaultLinks };
      
      data?.forEach(item => {
        if (item.content_th) {
          switch (item.section_key) {
            case 'social_facebook':
              newLinks.facebook = item.content_th;
              break;
            case 'social_instagram':
              newLinks.instagram = item.content_th;
              break;
            case 'social_tiktok':
              newLinks.tiktok = item.content_th;
              break;
            case 'social_youtube':
              newLinks.youtube = item.content_th;
              break;
          }
        }
      });

      setLinks(newLinks);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { links, isLoading, refetch: fetchLinks };
};
