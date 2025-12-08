import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BusinessItem {
  name: string;
  description: string;
  url: string;
  image: string;
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
      <div className="hidden lg:flex h-[520px] gap-1.5 overflow-hidden rounded-2xl shadow-2xl bg-stone-200 dark:bg-stone-800 p-1.5">
        {businesses.map((business, index) => {
          const isActive = activeIndex === index;
          
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
                {/* Background Image */}
                <img
                  src={business.image}
                  alt={business.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700",
                    isActive ? "scale-110 blur-sm" : "scale-100"
                  )}
                />
                
                {/* Overlay - Dimmed for collapsed, Light cream for expanded */}
                <div 
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    isActive 
                      ? "bg-gradient-to-b from-amber-50/95 via-orange-50/90 to-amber-100/95 dark:from-amber-950/95 dark:via-stone-900/90 dark:to-amber-950/95" 
                      : "bg-gradient-to-b from-stone-800/80 via-stone-900/75 to-stone-800/85 dark:from-stone-900/85 dark:via-stone-950/80 dark:to-stone-900/90"
                  )}
                />
              </div>
              
              {/* Collapsed State - Logo + Vertical Text */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center pt-8 pb-8 transition-all duration-500",
                  isActive ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                )}
              >
                {/* Logo Container */}
                <div className="w-14 h-14 bg-white rounded-lg p-2 shadow-lg flex items-center justify-center shrink-0 border border-stone-200/50">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Vertical Text */}
                <div 
                  className="flex-1 flex items-center justify-center mt-6"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <span className="text-white font-bold text-xs tracking-[0.25em] uppercase text-center drop-shadow-lg whitespace-nowrap">
                    {business.name}
                  </span>
                </div>
              </div>

              {/* Expanded State - Full Content */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700",
                  isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                )}
              >
                {/* Large Logo Container */}
                <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center mb-6 border border-stone-200/50">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
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
                  "absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all duration-500",
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: Accordion Stack */}
      <div className="lg:hidden flex flex-col gap-2 bg-stone-100 dark:bg-stone-800 p-2 rounded-2xl">
        {businesses.map((business, index) => {
          const isActive = mobileActiveIndex === index;
          
          return (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-500",
                isActive 
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-stone-900" 
                  : "bg-white dark:bg-stone-900"
              )}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setMobileActiveIndex(isActive ? null : index)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center border border-stone-200/50 dark:border-stone-700">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-stone-800 dark:text-white text-left">
                    {business.name}
                  </h3>
                </div>
                
                {/* Arrow */}
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-stone-500 dark:text-stone-400 transition-transform duration-300 shrink-0",
                    isActive && "rotate-180"
                  )} 
                />
              </button>
              
              {/* Expandable Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-out",
                  isActive ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-4">
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 leading-relaxed">
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
