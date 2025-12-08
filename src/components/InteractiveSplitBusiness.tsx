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
      <div className="hidden lg:flex h-[500px] gap-2 overflow-hidden rounded-2xl">
        {businesses.map((business, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer transition-all duration-500 ease-out overflow-hidden rounded-xl",
                isActive ? "flex-[4]" : "flex-1",
                "group"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background */}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-b transition-all duration-500",
                  isActive 
                    ? "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" 
                    : "from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900"
                )}
              />
              
              {/* Collapsed State */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-start pt-6 transition-all duration-500",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                {/* Logo */}
                <div className="w-16 h-16 mb-4 bg-white dark:bg-card rounded-lg p-2 shadow-md flex items-center justify-center">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Vertical Text */}
                <div 
                  className="writing-vertical-rl text-center font-bold text-sm tracking-widest text-foreground/80 uppercase"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {business.name}
                </div>
              </div>

              {/* Expanded State */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {/* Logo */}
                <div className="w-24 h-24 mb-6 bg-white dark:bg-card rounded-xl p-3 shadow-lg flex items-center justify-center">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                  {business.name}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-center mb-6 max-w-xs leading-relaxed">
                  {business.description}
                </p>
                
                {/* CTA Button */}
                <Button
                  asChild
                  className="bg-primary hover:bg-accent text-primary-foreground"
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
            </div>
          );
        })}
      </div>

      {/* Mobile: Accordion Stack */}
      <div className="lg:hidden flex flex-col gap-3">
        {businesses.map((business, index) => {
          const isActive = mobileActiveIndex === index;
          
          return (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-500",
                isActive 
                  ? "bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" 
                  : "bg-stone-100 dark:bg-stone-800"
              )}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setMobileActiveIndex(isActive ? null : index)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-lg p-2 shadow-sm flex items-center justify-center">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-foreground">
                    {business.name}
                  </h3>
                </div>
                
                {/* Arrow */}
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300",
                    isActive && "rotate-180"
                  )} 
                />
              </button>
              
              {/* Expandable Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  isActive ? "max-h-60 pb-4" : "max-h-0"
                )}
              >
                <div className="px-4 pt-2">
                  <p className="text-muted-foreground text-sm mb-4">
                    {business.description}
                  </p>
                  
                  <Button
                    asChild
                    size="sm"
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
