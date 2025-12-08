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
  date: string;
  image: string;
  isVideo: boolean;
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'company': return t('news.companyNews');
      case 'press': return t('news.pressRelease');
      case 'csr': return 'CSR';
      default: return t('news.companyNews');
    }
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
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as NewsItem[];
    },
  });

  const formattedNews: FormattedNewsItem[] = (newsItems || []).map((item) => ({
    id: item.id,
    title: getLocalizedField(item, 'title'),
    excerpt: getLocalizedField(item, 'excerpt'),
    content: getLocalizedField(item, 'content'),
    category: getCategoryLabel(item.category),
    categoryType: item.category as FormattedNewsItem['categoryType'],
    date: formatDate(item.published_at),
    image: item.image_url || '/placeholder.svg',
    isVideo: !!item.video_url,
    isFeatured: item.is_featured,
  }));

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
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createNews = useMutation({
    mutationFn: async (newsData: { title_th: string } & Partial<Omit<NewsItem, 'title_th'>>) => {
      const { data, error } = await supabase
        .from('news')
        .insert(newsData)
        .select()
        .single();

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
        .single();

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