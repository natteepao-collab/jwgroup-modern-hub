import { useState, useRef, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Calendar, ArrowRight, Play, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Enhanced Mockup placeholder for news without images
const NewsMockupPlaceholder = ({ isLarge = false, title = '' }: { isLarge?: boolean; title?: string }) => {
  // Generate a gradient based on title for variety
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
      "w-full h-full flex flex-col items-center justify-center relative overflow-hidden",
      `bg-gradient-to-br ${gradient}`
    )}>
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-6">
        <div className={cn(
          "mx-auto mb-4 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center",
          isLarge ? "w-20 h-20" : "w-14 h-14"
        )}>
          <ImageIcon className={cn(
            "text-white/70",
            isLarge ? "h-10 w-10" : "h-7 w-7"
          )} />
        </div>
        <p className={cn(
          "text-white/80 font-medium",
          isLarge ? "text-base" : "text-sm"
        )}>
          JW GROUP
        </p>
        <p className={cn(
          "text-white/60 mt-1",
          isLarge ? "text-sm" : "text-xs"
        )}>
          รอการอัพโหลดรูปภาพ
        </p>
      </div>
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

type FilterType = 'all' | 'company' | 'press' | 'csr';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryType: FilterType;
  date: string;
  image: string;
  isVideo?: boolean;
  size?: 'large' | 'medium' | 'small' | 'text-only';
}

interface BentoNewsCardProps {
  news: NewsItem;
  index: number;
  inView: boolean;
}

const BentoNewsCard = ({ news, index, inView }: BentoNewsCardProps) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * 15,
      y: (x - 0.5) * -15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isLarge = news.size === 'large';
  const isMedium = news.size === 'medium';
  const isTextOnly = news.size === 'text-only';

  // Grid span classes based on size
  const gridClasses = cn(
    "relative overflow-hidden rounded-2xl cursor-pointer group",
    isLarge && "md:col-span-2 md:row-span-2",
    isMedium && "md:col-span-1 md:row-span-2",
    isTextOnly && "md:col-span-1 md:row-span-1",
    !isLarge && !isMedium && !isTextOnly && "md:col-span-1 md:row-span-1"
  );

  if (isTextOnly) {
    return (
      <div
        ref={cardRef}
        className={cn(
          gridClasses,
          "bg-card border border-border/50 p-6 flex flex-col justify-between transition-all duration-500",
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
        style={{
          transitionDelay: `${index * 80}ms`,
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        <div>
          <Badge variant="outline" className="mb-3 text-xs">
            {news.category}
          </Badge>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-3">
            {news.title}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {news.date}
          </span>
          <Link 
            to={`/news/${news.id}`}
            className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {t('news.readMore')}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // Fixed height for small cards
  const cardHeight = isLarge 
    ? "min-h-[400px] md:min-h-[500px]" 
    : isMedium 
      ? "min-h-[300px] md:min-h-[400px]" 
      : "h-[280px] md:h-[320px]";

  return (
    <Link
      to={`/news/${news.id}`}
      className={cn(
        gridClasses,
        "block",
        cardHeight,
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        ref={cardRef}
        className="w-full h-full relative"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {news.image && news.image !== '/placeholder.svg' && news.image !== '' ? (
            <img
              src={news.image}
              alt={news.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                isHovered ? "scale-110 brightness-110" : "scale-100"
              )}
              loading="lazy"
            />
          ) : (
            <NewsMockupPlaceholder isLarge={isLarge} title={news.title} />
          )}
          {/* Video Play Icon */}
          {news.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl transition-all duration-300",
                isHovered ? "scale-110" : "scale-100"
              )}>
                <Play className="h-6 w-6 text-primary ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-500",
            isHovered
              ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              : "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          )}
        />

        {/* Category Badge - Top */}
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            className={cn(
              "bg-primary text-primary-foreground shadow-lg transition-all duration-300",
              isHovered ? "scale-105" : ""
            )}
          >
            {news.category}
          </Badge>
        </div>

        {/* Content - Bottom with Slide Up Animation */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6 transition-all duration-500",
            isHovered ? "translate-y-0" : "translate-y-4"
          )}
        >
          {/* Date */}
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Calendar className="h-4 w-4" />
            <span>{news.date}</span>
          </div>

          {/* Title - Large Typography */}
          <h3 
            className={cn(
              "font-bold text-white mb-3 transition-all duration-300 line-clamp-2",
              isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            )}
          >
            {news.title}
          </h3>

          {/* Excerpt - Revealed on Hover */}
          <p 
            className={cn(
              "text-white/80 text-sm mb-4 line-clamp-2 transition-all duration-500",
              isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
            )}
          >
            {news.excerpt}
          </p>

          {/* Read More Button - Revealed on Hover */}
          <div 
            className={cn(
              "transition-all duration-500",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button 
              variant="secondary" 
              size={isLarge ? "default" : "sm"}
              className="group/btn"
            >
              {t('news.readMore')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `linear-gradient(
              ${105 + tilt.y * 2}deg,
              transparent 40%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 60%
            )`,
          }}
        />
      </div>
    </Link>
  );
};

interface BentoNewsSectionProps {
  news: Omit<NewsItem, 'size'>[];
  showFilters?: boolean;
  maxItems?: number;
}

export const BentoNewsSection = ({ news, showFilters = true, maxItems }: BentoNewsSectionProps) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('news.all') },
    { key: 'company', label: t('news.companyNews') },
    { key: 'press', label: t('news.pressRelease') },
  ];

  // Assign sizes to news items for Bento Grid layout
  const assignSizes = (items: Omit<NewsItem, 'size'>[]): NewsItem[] => {
    return items.map((item, index) => {
      let size: NewsItem['size'] = 'small';
      
      // First item is always large (hero)
      if (index === 0) {
        size = 'large';
      } 
      // Second item is medium (side column top)
      else if (index === 1) {
        size = 'medium';
      }
      // Items 2, 3, 4 are small cards - all same size
      else {
        size = 'small';
      }
      
      return { ...item, size };
    });
  };

  const filteredNews = activeFilter === 'all' 
    ? news 
    : news.filter(item => item.categoryType === activeFilter);

  const displayNews = assignSizes(maxItems ? filteredNews.slice(0, maxItems) : filteredNews);

  return (
    <div ref={ref}>
      {/* Animated Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "transition-all duration-300 relative overflow-hidden",
                activeFilter === filter.key && "shadow-lg shadow-primary/25"
              )}
            >
              <span className="relative z-10">{filter.label}</span>
              {activeFilter === filter.key && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        {displayNews.map((newsItem, index) => (
          <BentoNewsCard 
            key={newsItem.id} 
            news={newsItem} 
            index={index}
            inView={inView}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayNews.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          ไม่พบข่าวสารในหมวดหมู่นี้
        </div>
      )}
    </div>
  );
};