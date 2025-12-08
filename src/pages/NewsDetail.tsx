import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Facebook, Share2, MessageCircle, Link2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import i18n from 'i18next';
import { cn } from '@/lib/utils';

// Placeholder component for news without images
const NewsImagePlaceholder = ({ title = '' }: { title?: string }) => {
  const gradients = [
    'from-blue-500/30 via-blue-400/20 to-indigo-500/30',
    'from-orange-500/30 via-amber-400/20 to-yellow-500/30',
    'from-green-500/30 via-emerald-400/20 to-teal-500/30',
    'from-purple-500/30 via-violet-400/20 to-pink-500/30',
    'from-rose-500/30 via-red-400/20 to-orange-500/30',
  ];
  
  const gradientIndex = title ? title.charCodeAt(0) % gradients.length : 0;
  const gradient = gradients[gradientIndex];

  return (
    <div className={cn(
      "w-full h-96 flex flex-col items-center justify-center relative overflow-hidden rounded-lg",
      `bg-gradient-to-br ${gradient}`
    )}>
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
      
      <div className="relative z-10 text-center p-6">
        <div className="mx-auto mb-4 w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <ImageIcon className="h-10 w-10 text-white/70" />
        </div>
        <p className="text-white/80 font-medium text-lg">JW GROUP</p>
        <p className="text-white/60 mt-1">รอการอัพโหลดรูปภาพ</p>
      </div>
    </div>
  );
};

// Social Share Buttons Component
const SocialShareButtons = ({ title, url }: { title: string; url: string }) => {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'คัดลอกลิงก์แล้ว',
        description: 'ลิงก์ถูกคัดลอกไปยังคลิปบอร์ด',
      });
    } catch {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถคัดลอกลิงก์ได้',
        variant: 'destructive',
      });
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        แชร์:
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
        onClick={() => openShare('facebook')}
        title="แชร์บน Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-black hover:text-white hover:border-black transition-colors"
        onClick={() => openShare('twitter')}
        title="แชร์บน X (Twitter)"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
        onClick={() => openShare('line')}
        title="แชร์บน LINE"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-muted transition-colors"
        onClick={copyLink}
        title="คัดลอกลิงก์"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const NewsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const currentLang = i18n.language;

  const { data: newsItem, isLoading, error } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No news ID provided');
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Get localized content
  const getLocalizedContent = () => {
    if (!newsItem) return { title: '', excerpt: '', content: '' };
    
    let title = newsItem.title_th;
    let excerpt = newsItem.excerpt_th || '';
    let content = newsItem.content_th || '';

    if (currentLang === 'en') {
      title = newsItem.title_en || newsItem.title_th;
      excerpt = newsItem.excerpt_en || newsItem.excerpt_th || '';
      content = newsItem.content_en || newsItem.content_th || '';
    } else if (currentLang === 'cn') {
      title = newsItem.title_cn || newsItem.title_th;
      excerpt = newsItem.excerpt_cn || newsItem.excerpt_th || '';
      content = newsItem.content_cn || newsItem.content_th || '';
    }

    return { title, excerpt, content };
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'company': return t('news.companyNews');
      case 'press': return t('news.pressRelease');
      case 'csr': return 'CSR';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-24 mb-6" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-96 w-full mb-8 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="pt-24 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/news" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              ไม่พบข่าวสารที่ต้องการ
            </h1>
            <p className="text-muted-foreground mb-8">
              ข่าวสารนี้อาจถูกลบหรือไม่เผยแพร่แล้ว
            </p>
            <Button asChild>
              <Link to="/news">ดูข่าวสารทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { title, content } = getLocalizedContent();
  const currentUrl = window.location.href;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/news" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4">{getCategoryLabel(newsItem.category)}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
              </div>
              <SocialShareButtons title={title} url={currentUrl} />
            </div>
          </div>

          <div className="mb-8">
            {newsItem.image_url ? (
              <img
                src={newsItem.image_url}
                alt={title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
              />
            ) : (
              <NewsImagePlaceholder title={title} />
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content ? (
              content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-lg mb-4 leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                )
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                เนื้อหาข่าวจะถูกเพิ่มเร็วๆ นี้
              </p>
            )}
          </div>

          {/* Bottom Share Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground">ชอบบทความนี้? แชร์ให้เพื่อนๆ ของคุณ</p>
              <SocialShareButtons title={title} url={currentUrl} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
