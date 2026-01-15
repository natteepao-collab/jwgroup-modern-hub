import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BusinessItem {
  name: string;
  description: string;
  url: string;
  image: string; // Logo image
  backgroundImage?: string; // Optional separate background image
  brandColor?: {
    collapsed: string; // Collapsed state bg color
    expanded: string; // Expanded state gradient
    expandedDark: string; // Expanded state gradient for dark mode
  };
  logoStyle?: {
    scale?: number; // Scale factor for logo (1 = normal, 1.2 = 20% larger)
    objectFit?: 'contain' | 'cover' | 'fill';
  };
}

interface InteractiveSplitBusinessProps {
  businesses: BusinessItem[];
}

export const InteractiveSplitBusiness = ({ businesses }: InteractiveSplitBusinessProps) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: Vertical Accordion Layout */}
      <div className="hidden xl:flex h-[520px] gap-1.5 overflow-hidden rounded-2xl shadow-2xl bg-stone-200 dark:bg-stone-800 p-1.5">
        {businesses.map((business, index) => {
          const isActive = activeIndex === index;
          const bgImage = business.backgroundImage || business.image;
          
          return (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                isActive ? "flex-[6]" : "flex-1"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background Layer */}
              <div className="absolute inset-0">
                {/* Full-size Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={bgImage}
                    alt=""
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive 
                        ? "opacity-100 scale-110" 
                        : "opacity-90 scale-100"
                    )}
                    style={{
                      filter: isActive ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.85) saturate(0.9)'
                    }}
                  />
                </div>
                
                {/* Gradient overlay - lighter for collapsed, gradient for expanded */}
                <div 
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    isActive 
                      ? "bg-gradient-to-t from-white/95 via-white/70 to-white/40 dark:from-stone-900/95 dark:via-stone-900/70 dark:to-stone-900/40" 
                      : "bg-stone-500/40 dark:bg-stone-700/50"
                  )}
                />
              </div>
              
              {/* Collapsed State - Logo + Vertical Text */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center pt-8 pb-8 transition-all duration-500 z-10",
                  isActive ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                )}
              >
                {/* Logo Container */}
                <div className="w-20 h-20 bg-white rounded-xl p-3 shadow-lg flex items-center justify-center shrink-0 border border-stone-200/50">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full"
                    style={{ 
                      objectFit: business.logoStyle?.objectFit || 'contain',
                      transform: `scale(${business.logoStyle?.scale || 1})`
                    }}
                  />
                </div>
                
                {/* Vertical Text */}
                <div 
                  className="flex-1 flex items-center justify-center mt-6"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <span className="text-white font-bold text-sm tracking-[0.2em] uppercase text-center whitespace-nowrap" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)' }}>
                    {business.name}
                  </span>
                </div>
              </div>

              {/* Expanded State - Full Content */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700 z-10",
                  isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                )}
              >
                {/* Large Logo Container */}
                <div className="w-32 h-32 bg-white rounded-2xl p-5 flex items-center justify-center mb-6">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full"
                    style={{ 
                      objectFit: business.logoStyle?.objectFit || 'contain',
                      transform: `scale(${business.logoStyle?.scale || 1})`
                    }}
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-white mb-4 text-center tracking-wide">
                  {business.name}
                </h3>
                
                {/* Description */}
                <p className="text-stone-600 dark:text-stone-300 text-center mb-8 max-w-sm leading-relaxed text-sm md:text-base">
                  {business.description}
                </p>
                
                {/* CTA Button - Orange */}
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-8"
                >
                  <a 
                    href={business.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('business.viewWebsite')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Bottom Accent Line */}
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all duration-500 z-20",
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Tablet: Grid 2x2 Layout */}
      <div className="hidden md:grid xl:hidden grid-cols-2 gap-4 bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl">
        {businesses.map((business, index) => {
          const bgImage = business.backgroundImage || business.image;
          
          return (
            <a
              key={index}
              href={business.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl h-[280px] transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={bgImage}
                  alt=""
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  style={{ filter: 'brightness(0.85)' }}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/70" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                {/* Logo */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-xl p-2.5 shadow-lg flex items-center justify-center border border-stone-200/50 transition-all duration-300 group-hover:scale-110">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full"
                    style={{ 
                      objectFit: business.logoStyle?.objectFit || 'contain',
                      transform: `scale(${business.logoStyle?.scale || 1})`
                    }}
                  />
                </div>
                
                {/* Title & Description */}
                <div className="transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {business.name}
                  </h3>
                  <p className="text-stone-200 text-sm line-clamp-2 mb-3 opacity-90">
                    {business.description}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>{t('business.viewWebsite')}</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Hover Accent Border */}
              <div className="absolute inset-0 border-2 border-primary/0 rounded-xl transition-all duration-300 group-hover:border-primary/50" />
            </a>
          );
        })}
      </div>

      {/* Mobile: Accordion Stack */}
      <div className="md:hidden flex flex-col gap-2 bg-stone-100 dark:bg-stone-800 p-2 rounded-2xl">
        {businesses.map((business, index) => {
          const isActive = mobileActiveIndex === index;
          const bgImage = business.backgroundImage || business.image;
          
          return (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-500 relative",
                isActive 
                  ? "bg-white dark:bg-stone-900" 
                  : "bg-stone-600 dark:bg-stone-700"
              )}
            >
              {/* Full-size Background Image for mobile */}
              {!isActive && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={bgImage}
                    alt=""
                    className="w-full h-full object-cover opacity-50"
                    style={{ filter: 'brightness(0.7)' }}
                  />
                </div>
              )}
              
              {/* Header - Always visible */}
              <button
                onClick={() => setMobileActiveIndex(isActive ? null : index)}
                className="w-full flex items-center justify-between p-4 relative z-10"
              >
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center border border-stone-200/50 dark:border-stone-700">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full"
                      style={{ 
                        objectFit: business.logoStyle?.objectFit || 'contain',
                        transform: `scale(${business.logoStyle?.scale || 1})`
                      }}
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className={cn(
                    "font-bold text-left transition-colors",
                    isActive ? "text-stone-800 dark:text-white" : "text-white"
                  )}>
                    {business.name}
                  </h3>
                </div>
                
                {/* Arrow */}
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 transition-all duration-300 shrink-0",
                    isActive ? "rotate-180 text-stone-500 dark:text-stone-400" : "text-white/80"
                  )} 
                />
              </button>
              
              {/* Expandable Content */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out relative z-10",
                  isActive ? "max-h-[800px] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"
                )}
              >
                <div className="px-4 pb-6">
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-5 leading-relaxed whitespace-pre-line">
                    {business.description}
                  </p>
                  
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-accent text-primary-foreground"
                  >
                    <a 
                      href={business.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {t('business.viewWebsite')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
