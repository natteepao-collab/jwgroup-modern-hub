import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Trophy, Award as AwardIcon, Medal, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Award {
  id: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  image_url: string | null;
  award_year: number | null;
  awarding_organization: string | null;
  category: string;
}

// Helper to parse image_url (can be JSON array or single URL string)
const parseImages = (imageUrl: string | null): string[] => {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) return parsed;
    return [imageUrl];
  } catch {
    return imageUrl ? [imageUrl] : [];
  }
};

const AwardCard = ({ 
  award, 
  index, 
  inView,
  onImageClick 
}: { 
  award: Award; 
  index: number; 
  inView: boolean;
  onImageClick: (images: string[], startIndex: number, title: string) => void;
}) => {
  const { i18n } = useTranslation();
  const images = parseImages(award.image_url);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getTitle = () => {
    const lang = i18n.language;
    if (lang === 'en' && award.title_en) return award.title_en;
    if (lang === 'cn' && award.title_cn) return award.title_cn;
    return award.title_th;
  };

  const getDescription = () => {
    const lang = i18n.language;
    if (lang === 'en' && award.description_en) return award.description_en;
    if (lang === 'cn' && award.description_cn) return award.description_cn;
    return award.description_th;
  };

  const getIcon = () => {
    if (award.category === 'certification') {
      return <Medal className="w-8 h-8" />;
    }
    return index % 2 === 0 ? <Trophy className="w-8 h-8" /> : <AwardIcon className="w-8 h-8" />;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Section */}
      {images.length > 0 ? (
        <div className="relative h-52 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={getTitle()}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
            onClick={() => onImageClick(images, currentImageIndex, getTitle())}
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-primary w-4' 
                        : 'bg-background/60 hover:bg-background/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          {/* Year Badge */}
          {award.award_year && (
            <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-lg">
              {award.award_year}
            </span>
          )}
          
          {/* Category Badge */}
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full shadow-lg ${
            award.category === 'certification' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {award.category === 'certification' ? 'การรับรอง' : 'รางวัล'}
          </span>
        </div>
      ) : (
        <div className="relative h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            {getIcon()}
          </div>
          
          {/* Year Badge */}
          {award.award_year && (
            <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground">
              {award.award_year}
            </span>
          )}
          
          {/* Category Badge */}
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${
            award.category === 'certification' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {award.category === 'certification' ? 'การรับรอง' : 'รางวัล'}
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {getTitle()}
        </h3>
        
        {getDescription() && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {getDescription()}
          </p>
        )}
        
        {award.awarding_organization && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1 flex-1">
              {award.awarding_organization}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Lightbox Component
const ImageLightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  title,
  onIndexChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  images: string[]; 
  currentIndex: number;
  title: string;
  onIndexChange: (index: number) => void;
}) => {
  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-background/95 backdrop-blur-md border-0">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Main Image */}
          <div className="relative aspect-[16/10] w-full">
            <img
              src={images[currentIndex]}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* Title and Indicators */}
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {images.length > 1 && (
              <div className="flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onIndexChange(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AwardsSection = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { t } = useTranslation();
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  useEffect(() => {
    const fetchAwards = async () => {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_published', true)
        .order('position_order', { ascending: true });

      if (!error && data) {
        setAwards(data);
      }
      setIsLoading(false);
    };

    fetchAwards();
  }, []);

  const handleImageClick = (images: string[], startIndex: number, title: string) => {
    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                <div className="h-52 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (awards.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Decorative Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            รางวัลและความสำเร็จ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ความสำเร็จและการยอมรับจากองค์กรชั้นนำ ที่สะท้อนถึงมาตรฐานและคุณภาพของเรา
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{awards.filter(a => a.category === 'award').length}</div>
              <div className="text-sm text-muted-foreground">รางวัล</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">{awards.filter(a => a.category === 'certification').length}</div>
              <div className="text-sm text-muted-foreground">การรับรอง</div>
            </div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <AwardCard 
              key={award.id} 
              award={award} 
              index={index} 
              inView={inView}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        title={lightboxTitle}
        onIndexChange={setLightboxIndex}
      />
    </section>
  );
};

export default AwardsSection;