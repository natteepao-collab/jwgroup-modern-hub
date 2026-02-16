import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Facebook, Share2, MessageCircle, Link2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import i18n from 'i18next';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { SEO } from '@/components/SEO';

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

const ImageGalleryWithThumbnails = ({
  mainImage,
  galleryImages,
  title
}: {
  mainImage: string | null;
  galleryImages: string[];
  title: string;
}) => {
  // Combine main image with gallery images
  const allImages = mainImage ? [mainImage, ...galleryImages] : galleryImages;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (allImages.length === 0) {
    return <NewsImagePlaceholder title={title} />;
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-muted cursor-pointer group flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
        onClick={openModal}
      >
        <img
          src={allImages[selectedIndex]}
          alt={`${title} - รูปที่ ${selectedIndex + 1}`}
          className="max-w-full max-h-[600px] w-auto h-auto object-contain transition-transform duration-500"
        />

        {/* Zoom indicator on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <span className="text-sm">คลิกเพื่อขยาย</span>
          </div>
        </div>

        {/* Navigation arrows on main image */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none shadow-none focus:outline-none overflow-hidden">
          <div className="relative flex flex-col max-h-[95vh]">
            {/* Main modal image */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <img
                src={allImages[selectedIndex]}
                alt={`${title} - รูปที่ ${selectedIndex + 1}`}
                className="max-w-[90vw] max-h-[75vh] w-auto h-auto object-contain rounded-lg"
              />
            </div>

            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal thumbnails */}
            {allImages.length > 1 && (
              <div className="p-4 bg-black/50">
                <div className="flex gap-2 justify-center overflow-x-auto">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={cn(
                        "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                        selectedIndex === index
                          ? "border-white scale-110"
                          : "border-transparent opacity-50 hover:opacity-80"
                      )}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {selectedIndex + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

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
        <SEO title="News Not Found" noindex={true} />
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

  const getGalleryImages = () => {
    if (!newsItem?.video_url) return [];
    try {
      if (newsItem.video_url.trim().startsWith('[')) {
        const parsed = JSON.parse(newsItem.video_url);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) { return []; }
    return [];
  };

  const galleryImages = getGalleryImages();

  // Structured Data (JSON-LD) for Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": newsItem.image_url ? [newsItem.image_url, ...galleryImages] : [window.location.origin + '/og-image.png'],
    "datePublished": newsItem.created_at,
    "dateModified": newsItem.updated_at || newsItem.created_at,
    "author": [{
      "@type": "Organization",
      "name": "JW Group",
      "url": "https://www.jwgroupthailand.com"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "JW Group",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.jwgroupthailand.com/logo.png"
      }
    },
    "description": getLocalizedContent().excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={title}
        description={getLocalizedContent().excerpt}
        ogImage={newsItem.image_url}
        canonicalUrl={`/news/${id}`}
        ogType="article"
        structuredData={articleSchema}
      />
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
            <ImageGalleryWithThumbnails
              mainImage={newsItem.image_url}
              galleryImages={galleryImages}
              title={title}
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content ? (
              <div
                className="[&>p]:text-lg [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-foreground/90"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
              />
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
      </div >
    </div >
  );
};

export default NewsDetail;
