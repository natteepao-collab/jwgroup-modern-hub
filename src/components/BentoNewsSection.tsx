import React, { useState, useRef, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Calendar, ArrowRight, Play, ImageIcon, Building2, Hotel, Heart, Stethoscope, HardHat, LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBusinessTypes } from '@/hooks/useBusinessTypes';

// Enhanced Mockup placeholder for news without images
const NewsMockupPlaceholder = ({ isLarge = false, title = '' }: { isLarge?: boolean; title?: string }) => {
  return <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-4 text-muted-foreground"><ImageIcon className={isLarge ? "h-10 w-10" : "h-7 w-7"} /><span>JW GROUP</span></div>;

};

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  hotel: Hotel,
  heart: Heart,
  stethoscope: Stethoscope,
  hardhat: HardHat,
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return Building2;
  return iconMap[iconName.toLowerCase()] || Building2;
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryType: string;
  date: string;
  image: string;
  isVideo?: boolean;
  size?: 'large' | 'medium' | 'small' | 'text-only';
  businessType?: string;
}

interface BentoNewsCardProps {
  news: NewsItem;
  index: number;
  inView: boolean;
  businessTypes?: { business_key: string; name_th: string; color: string | null }[];
}

// Business type badge colors - dynamic version
const getBusinessTypeBadge = (
  businessType: string | undefined,
  businessTypes?: { business_key: string; name_th: string; color: string | null }[]
) => {
  if (!businessTypes) {
    return { label: 'ทั่วไป', className: 'bg-gray-500 hover:bg-gray-600' };
  }
  
  const found = businessTypes.find(bt => bt.business_key === businessType);
  if (found) {
    return { 
      label: found.name_th, 
      className: '', 
      style: { backgroundColor: found.color || '#6b7280' } 
    };
  }
  return { label: 'ทั่วไป', className: 'bg-gray-500 hover:bg-gray-600', style: undefined };
};

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

  const gridClasses = cn(
    "relative overflow-hidden rounded-lg cursor-pointer group",
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
          <div className="flex gap-2 mb-3">
            <Badge 
              className={cn(
                "text-primary-foreground text-xs",
                getBusinessTypeBadge(news.businessType).className
              )}
            >
              {getBusinessTypeBadge(news.businessType).label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {news.category}
            </Badge>
          </div>
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
        <div className="absolute inset-0 overflow-hidden rounded-lg">
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
          {news.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-16 h-16 rounded-full bg-card/90 flex items-center justify-center shadow-xl transition-all duration-300",
                isHovered ? "scale-110" : "scale-100"
              )}>
                <Play className="h-6 w-6 text-primary ml-1" />
              </div>
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-500",
            isHovered
              ? "bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent"
              : "bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent"
          )}
        />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge
            className={cn(
              "text-primary-foreground shadow-lg transition-all duration-300",
              getBusinessTypeBadge(news.businessType).className,
              isHovered ? "scale-105" : ""
            )}
          >
            {getBusinessTypeBadge(news.businessType).label}
          </Badge>
          <Badge
            variant="secondary"
            className={cn(
              "bg-black/50 text-primary-foreground backdrop-blur-sm shadow-lg transition-all duration-300",
              isHovered ? "scale-105" : ""
            )}
          >
            {news.category}
          </Badge>
        </div>

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6 transition-all duration-500",
            isHovered ? "translate-y-0" : "translate-y-4"
          )}
        >
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
            <Calendar className="h-4 w-4" />
            <span>{news.date}</span>
          </div>

          <h3
            className={cn(
              "font-bold text-primary-foreground mb-3 transition-all duration-300 line-clamp-2",
              isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            )}
          >
            {news.title}
          </h3>

          <p
            className={cn(
              "text-primary-foreground/80 text-sm mb-4 line-clamp-2 transition-all duration-500",
              isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
            )}
          >
            {news.excerpt}
          </p>

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

        <div
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500",
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

// Uniform News Card for Grid Layout
const UniformNewsCard = ({ news, index, inView, businessTypes }: BentoNewsCardProps) => {
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
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isFeatured = (news as NewsItem & { isFeatured?: boolean }).isFeatured;

  return (
    <Link
      to={`/news/${news.id}`}
      className={cn(
        "news-card relative overflow-hidden rounded-lg cursor-pointer group block transition-all duration-500",
        isFeatured ? "h-[240px] col-span-2 sm:col-span-1 sm:h-[320px]" : "h-[200px] sm:h-[320px]",
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
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
        <div className="absolute inset-0 overflow-hidden rounded-lg">
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
            <NewsMockupPlaceholder isLarge={false} title={news.title} />
          )}
          {news.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-14 h-14 rounded-full bg-card/90 flex items-center justify-center shadow-xl transition-all duration-300",
                isHovered ? "scale-110" : "scale-100"
              )}>
                <Play className="h-5 w-5 text-primary ml-1" />
              </div>
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-500",
            isHovered
              ? "bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent"
              : "bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent"
          )}
        />

        <div className={cn(
          "absolute z-10 flex gap-2",
          isFeatured ? "top-4 left-4" : "top-2 left-2 sm:top-4 sm:left-4"
        )}>
          {(() => {
            const badge = getBusinessTypeBadge(news.businessType, businessTypes);
            return (
              <Badge
                className={cn(
                  "text-primary-foreground shadow-lg transition-all duration-300",
                  isFeatured ? "text-xs" : "text-[10px] px-1.5 py-0 sm:text-xs sm:px-2.5 sm:py-0.5",
                  badge.className,
                  isHovered ? "scale-105" : ""
                )}
                style={badge.style}
              >
                {badge.label}
              </Badge>
            );
          })()}
        </div>


        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-500",
            isFeatured ? "p-4 sm:p-5" : "p-3 sm:p-5",
            isHovered ? "translate-y-0" : "translate-y-2"
          )}
        >
          <div className={cn(
            "flex items-center gap-1.5 text-primary-foreground/80 mb-1.5",
            isFeatured ? "text-xs sm:text-sm" : "text-[10px] sm:text-sm"
          )}>
            <Calendar className={isFeatured ? "h-3 w-3 sm:h-3.5 sm:w-3.5" : "h-3 w-3"} />
            <span>{news.date}</span>
          </div>

          <h3 className={cn(
            "font-bold text-primary-foreground line-clamp-2 transition-all duration-300",
            isFeatured ? "text-base sm:text-lg mb-2" : "text-sm sm:text-lg mb-1 sm:mb-2 leading-snug"
          )}>
            {news.title}
          </h3>

          <div
            className={cn(
              "hidden sm:block transition-all duration-500",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              variant="secondary"
              size="sm"
              className="group/btn"
            >
              {t('news.readMore')}
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>


        <div
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500",
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

// Business Type Tab Component
const BusinessTypeTabs = ({ 
  activeType, 
  onTypeChange,
  businessTypesData
}: { 
  activeType: string; 
  onTypeChange: (type: string) => void;
  businessTypesData: { business_key: string; name_th: string; icon_name: string | null; color: string | null }[];
}) => {
  const businessTypes = businessTypesData.map(bt => {
    const IconComponent = getIconComponent(bt.icon_name);
    return {
      key: bt.business_key,
      label: bt.name_th,
      icon: <IconComponent className="h-4 w-4 md:h-5 md:w-5" />,
      color: bt.color || '#d97706'
    };
  });

  return (
    <div className="relative mb-10">
      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-x-auto custom-scrollbar">
        <div className="bg-gradient-to-br from-background/80 via-card/60 to-background/80 backdrop-blur-xl rounded-lg p-1.5 md:p-2 border border-border/30 shadow-lg shadow-black/5 dark:shadow-black/20 inline-flex min-w-max md:w-auto md:mx-auto">
          <div className="flex gap-1 md:gap-1.5">
            {businessTypes.map((type) => {
              const isActive = activeType === type.key;
              return (
                <Button variant="ghost" aria-pressed={isActive}
                  key={type.key}
                  onClick={() => onTypeChange(type.key)}
                  className={cn(
                    "relative flex items-center gap-1.5 md:gap-2.5 px-3 py-2 md:px-5 md:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-xs md:text-sm tracking-wide",
                    isActive
                      ? "text-primary-foreground shadow-lg ring-1 ring-primary-foreground/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:shadow-sm"
                  )}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${type.color}, ${type.color}dd)`,
                    boxShadow: `0 10px 25px -5px ${type.color}50`
                  } : undefined}
                >
                  <span className={cn(
                    "transition-all duration-300",
                    isActive ? "scale-110 drop-shadow-sm" : "opacity-70"
                  )}>
                    {type.icon}
                  </span>
                  <span className={cn(
                    "font-semibold",
                    isActive && "drop-shadow-sm"
                  )}>
                    {type.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BentoNewsSectionProps {
  news: Omit<NewsItem, 'size'>[];
  showFilters?: boolean;
  maxItems?: number;
}

export const BentoNewsSection = ({ news, showFilters = true, maxItems }: BentoNewsSectionProps) => {
  const { t } = useTranslation();
  const { data: businessTypesData = [] } = useBusinessTypes();
  const [activeBusinessType, setActiveBusinessType] = useState<string>('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });


  // Set default active business type when data loads
  React.useEffect(() => {
    if (businessTypesData.length > 0 && !activeBusinessType) {
      setActiveBusinessType(businessTypesData[0].business_key);
    }
  }, [businessTypesData, activeBusinessType]);

  // กรองข่าวตามธุรกิจที่เลือก (เฉพาะเมื่อเปิด filter)
  const filteredNews = showFilters 
    ? news.filter(item => {
        const itemBusinessType = item.businessType || 'real_estate';
        return itemBusinessType === activeBusinessType;
      })
    : news;

  // ใช้ uniform size สำหรับ grid layout (item แรก เป็น featured บน mobile)
  const displayNews = (maxItems ? filteredNews.slice(0, maxItems) : filteredNews).map((item, idx) => ({
    ...item,
    size: 'small' as const,
    isFeatured: idx === 0,
  }));

  return (
    <div ref={ref}>
      {showFilters && businessTypesData.length > 0 && (
        <BusinessTypeTabs 
          activeType={activeBusinessType} 
          onTypeChange={setActiveBusinessType}
          businessTypesData={businessTypesData}
        />
      )}

      {/* Compact grid: 2-col on mobile (first item spans both), 3-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {displayNews.map((newsItem, index) => (
          <UniformNewsCard
            key={newsItem.id}
            news={newsItem}
            index={index}
            inView={inView}
            businessTypes={businessTypesData}
          />
        ))}
      </div>


      {displayNews.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-muted/50 flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('bento.noNews')}</h3>
          <p className="text-muted-foreground">{t('bento.noNewsDesc')}</p>

        </div>
      )}

    </div>
  );
};