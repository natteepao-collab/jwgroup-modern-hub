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
      <div className="hidden lg:flex h-[550px] gap-1 overflow-hidden rounded-2xl shadow-2xl">
        {businesses.map((business, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer overflow-hidden transition-all duration-700 ease-out",
                isActive ? "flex-[5]" : "flex-1",
                "group"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={business.image}
                  alt={business.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700",
                    isActive ? "scale-105" : "scale-100"
                  )}
                />
                {/* Dimmed Overlay for Collapsed State */}
                <div 
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    isActive 
                      ? "bg-gradient-to-t from-black/80 via-black/40 to-black/20" 
                      : "bg-gradient-to-b from-black/70 via-black/60 to-black/80"
                  )}
                />
              </div>
              
              {/* Collapsed State - Logo + Vertical Text */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-start pt-8 transition-all duration-500",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                {/* Logo Container */}
                <div className="w-16 h-16 mb-6 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg flex items-center justify-center">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Vertical Text */}
                <div 
                  className="flex-1 flex items-center justify-center"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <span className="text-white font-bold text-sm tracking-[0.3em] uppercase text-center drop-shadow-lg">
                    {business.name}
                  </span>
                </div>
              </div>

              {/* Expanded State - Full Content */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-10 transition-all duration-700",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}
              >
                {/* Large Logo */}
                <div className="w-28 h-28 mb-8 bg-white rounded-2xl p-4 shadow-2xl flex items-center justify-center transform transition-all duration-500">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-3xl font-bold text-white mb-4 text-center drop-shadow-lg">
                  {business.name}
                </h3>
                
                {/* Description */}
                <p className="text-white/90 text-center mb-8 max-w-md leading-relaxed text-lg drop-shadow-md">
                  {business.description}
                </p>
                
                {/* CTA Button */}
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-accent text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <a 
                    href={business.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lg"
                  >
                    {t('business.viewWebsite')}
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </div>

              {/* Hover Indicator Line */}
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: Accordion Stack */}
      <div className="lg:hidden flex flex-col gap-2">
        {businesses.map((business, index) => {
          const isActive = mobileActiveIndex === index;
          
          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setMobileActiveIndex(isActive ? null : index)}
                className="w-full relative overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={cn(
                    "absolute inset-0 transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-r from-black/60 to-black/40" 
                      : "bg-gradient-to-r from-black/70 to-black/50"
                  )} />
                </div>
                
                <div className="relative flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-14 h-14 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-white text-lg drop-shadow-lg">
                      {business.name}
                    </h3>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronDown 
                    className={cn(
                      "h-6 w-6 text-white transition-transform duration-300",
                      isActive && "rotate-180"
                    )} 
                  />
                </div>
              </button>
              
              {/* Expandable Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 bg-card",
                  isActive ? "max-h-72" : "max-h-0"
                )}
              >
                <div className="p-5">
                  <p className="text-muted-foreground mb-5 leading-relaxed">
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
