import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  excerpt_th: string | null;
  excerpt_en: string | null;
  excerpt_cn: string | null;
  content_th: string | null;
  content_en: string | null;
  content_cn: string | null;
  category: string;
  business_type: string;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface FormattedNewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryType: 'company' | 'press' | 'csr' | 'all';
  businessType: string;
  date: string;
  image: string;
  isVideo: boolean;
  galleryImages: string[];
  isFeatured: boolean;
}

export const useNews = () => {
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();

  const getLocalizedField = (item: NewsItem, field: 'title' | 'excerpt' | 'content') => {
    const lang = i18n.language;
    const thField = `${field}_th` as keyof NewsItem;
    const enField = `${field}_en` as keyof NewsItem;
    const cnField = `${field}_cn` as keyof NewsItem;

    if (lang === 'en' && item[enField]) return item[enField] as string;
    if (lang === 'cn' && item[cnField]) return item[cnField] as string;
    return item[thField] as string || '';
  };

  const getCategoryLabel = () => {
    // All news now uses single category - Press Release
    return 'ข่าวประชาสัมพันธ์';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const { data: newsItems, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsItem[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('news-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          console.log('News realtime update:', payload);
          // Invalidate and refetch news data
          queryClient.invalidateQueries({ queryKey: ['news'] });
          queryClient.invalidateQueries({ queryKey: ['news-admin'] });

          // Show toast notification for new news
          if (payload.eventType === 'INSERT') {
            const newNews = payload.new as NewsItem;
            if (newNews.is_published) {
              toast.info('มีข่าวใหม่!', {
                description: newNews.title_th,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const parseGalleryOrVideo = (url: string | null) => {
    if (!url) return { isVideo: false, gallery: [] };

    // Check if it's a JSON array (Gallery)
    if (url.trim().startsWith('[') && url.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(url);
        if (Array.isArray(parsed)) {
          return { isVideo: false, gallery: parsed as string[] };
        }
      } catch (e) {
        // Fallback to video if parse failed but it looks like array? 
        // Or strictly treat as string if parse fails.
        console.error('Failed to parse gallery JSON', e);
      }
    }

    // Otherwise treat as Video URL
    return { isVideo: true, gallery: [] };
  };

  const formattedNews: FormattedNewsItem[] = (newsItems || []).map((item) => {
    const { isVideo, gallery } = parseGalleryOrVideo(item.video_url);

    return {
      id: item.id,
      title: getLocalizedField(item, 'title'),
      excerpt: getLocalizedField(item, 'excerpt'),
      content: getLocalizedField(item, 'content'),
      category: getCategoryLabel(),
      categoryType: item.category as FormattedNewsItem['categoryType'],
      businessType: item.business_type || 'real_estate',
      date: formatDate(item.published_at),
      image: item.image_url || '',
      isVideo: isVideo,
      galleryImages: gallery,
      isFeatured: item.is_featured,
    };
  });

  return {
    news: formattedNews,
    isLoading,
    error,
  };
};

// Admin hook for managing news
export const useNewsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: allNews, isLoading } = useQuery({
    queryKey: ['news-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to realtime updates for admin
  useEffect(() => {
    const channel = supabase
      .channel('news-admin-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['news-admin'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createNews = useMutation({
    mutationFn: async (newsData: { title_th: string } & Partial<Omit<NewsItem, 'title_th'>>) => {
      const { data, error } = await supabase
        .from('news')
        .insert(newsData)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      toast.success('เพิ่มข่าวสำเร็จ');
    },
    onError: (error) => {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    },
  });

  const updateNews = useMutation({
    mutationFn: async ({ id, ...newsData }: Partial<NewsItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      toast.success('อัพเดทข่าวสำเร็จ');
    },
    onError: (error) => {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    },
  });

  const deleteNews = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      toast.success('ลบข่าวสำเร็จ');
    },
    onError: (error) => {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    },
  });

  return {
    news: allNews || [],
    isLoading,
    createNews,
    updateNews,
    deleteNews,
  };
};