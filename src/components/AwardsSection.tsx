import { useEffect, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Trophy, Award as AwardIcon, Medal, Star, ChevronLeft, ChevronRight, X, Image as ImageIcon, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

// Helper to parse image_url
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
      <DialogContent className="max-w-6xl w-full p-0 bg-black/95 border-0 text-white overflow-hidden">
        <div className="relative flex flex-col h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Main Image Area */}
          <div className="flex-1 relative flex items-center justify-center bg-black/40">
            <img
              src={images[currentIndex]}
              alt={title}
              className="max-h-full max-w-full object-contain"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-6 bg-black/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onIndexChange(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === currentIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AwardItem = ({
  award,
  onImageClick
}: {
  award: Award;
  onImageClick: (images: string[], startIndex: number, title: string) => void;
}) => {
  const { i18n } = useTranslation();
  const images = parseImages(award.image_url);

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

  return (
    <div className="group bg-card hover:bg-accent/5 rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="flex flex-col lg:flex-row">
        {/* Cover Image Section */}
        <div className="lg:w-2/5 relative min-h-[250px] lg:min-h-[300px] overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={getTitle()}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />

              {/* Image Gallery Trigger */}
              <div className="absolute bottom-4 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-zinc-900/90 hover:bg-zinc-800 text-white backdrop-blur-md shadow-lg gap-2 border border-white/10"
                  onClick={() => onImageClick(images, 0, getTitle())}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>ดูรูปภาพ ({images.length})</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-muted flex items-center justify-center">
              {award.category === 'certification' ? (
                <Medal className="w-32 h-32 text-primary/20" />
              ) : (
                <Trophy className="w-32 h-32 text-primary/20" />
              )}
            </div>
          )}

          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className={`text-sm px-3 py-1 shadow-lg backdrop-blur-md ${award.category === 'certification'
                ? 'bg-emerald-500/90 text-white hover:bg-emerald-500'
                : 'bg-amber-500/90 text-white hover:bg-amber-500'
                }`}
            >
              {award.category === 'certification' ? 'Certification' : 'Award'}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-primary font-medium mb-3">
              {award.awarding_organization && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1 rounded-full w-fit">
                  <Star className="w-3 h-3" />
                  {award.awarding_organization}
                </div>
              )}
              {award.award_year && (
                <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full w-fit text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {award.award_year}
                </div>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
              {getTitle()}
            </h3>

            {getDescription() && (
              <div
                className="text-muted-foreground text-lg leading-relaxed line-clamp-4 prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: getDescription() || '' }}
              />
            )}
          </div>

          <div className="pt-6 mt-auto border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {award.category === 'certification' ? (
                <Medal className="w-5 h-5 text-emerald-500" />
              ) : (
                <Trophy className="w-5 h-5 text-amber-500" />
              )}
              <span className="font-medium text-muted-foreground">
                {award.category === 'certification' ? 'การรับรองมาตรฐานคุณภาพ' : 'รางวัลแห่งความภาคภูมิใจ'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const YearSection = ({
  year,
  awards,
  onImageClick
}: {
  year: string;
  awards: Award[];
  onImageClick: (images: string[], startIndex: number, title: string) => void;
}) => {
  if (awards.length === 0) return null;

  return (
    <div className="mb-20 last:mb-0">
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-6xl md:text-8xl font-bold text-primary/10 font-display select-none">
          {year}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      <div className="space-y-12">
        {awards.map((award, idx) => (
          <div
            key={award.id}
            className={`transition-all duration-700`}
            style={{ transitionDelay: `${idx * 150}ms` }}
          >
            <AwardItem
              award={award}
              onImageClick={onImageClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AwardsSection = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

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
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAwards(data);
      }
      setIsLoading(false);
    };

    fetchAwards();
  }, []);

  const awardsByYear = useMemo(() => {
    const groups: { [key: string]: Award[] } = {};

    awards.forEach(award => {
      const year = award.award_year ? award.award_year.toString() : 'Other';
      if (!groups[year]) groups[year] = [];
      groups[year].push(award);
    });

    return Object.entries(groups).sort((a, b) => {
      if (a[0] === 'Other') return 1;
      if (b[0] === 'Other') return -1;
      return Number(b[0]) - Number(a[0]);
    });
  }, [awards]);

  const handleImageClick = (images: string[], startIndex: number, title: string) => {
    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground animate-pulse">Loading Awards...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

        {/* Abstract shapes */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-4 text-center z-10 animate-fade-in-up">
          <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/30 text-primary text-sm uppercase tracking-widest bg-background/50 backdrop-blur-sm">
            Hall of Fame
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground drop-shadow-sm">
            รางวัลและความสำเร็จ
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            เครื่องยืนยันคุณภาพและความมุ่งมั่นในการสร้างสรรค์สิ่งที่ดีที่สุด
            เพื่อส่งมอบคุณค่าที่ยั่งยืนให้กับลูกค้าและสังคม
          </p>
        </div>
      </section>

      <section ref={ref} className="pb-20 md:pb-32">
        <div className="container mx-auto px-4 max-w-5xl">
          {awardsByYear.map(([year, groupAwards]) => (
            <YearSection
              key={year}
              year={year}
              awards={groupAwards}
              onImageClick={handleImageClick}
            />
          ))}

          {awards.length === 0 && (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">ยังไม่มีข้อมูลรางวัล</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        title={lightboxTitle}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
};

export default AwardsSection;