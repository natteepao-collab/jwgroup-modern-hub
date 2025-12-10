import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "@/hooks/useSiteContent";
import jwLogo from "@/assets/jw-group-logo.png";
import modalImage from "@/assets/modal-realestate.jpg";

interface AnnouncementModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoShow?: boolean;
  delay?: number;
}

export const AnnouncementModal = ({
  open: controlledOpen,
  onOpenChange,
  autoShow = false,
  delay = 2000,
}: AnnouncementModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { t } = useTranslation();
  const { getContent, getImage } = useSiteContent();

  // Get content from database with fallback to i18n
  const modalContent = getContent('modal_welcome');
  const modalImageData = getImage('modal_welcome');
  
  const title = modalContent.title || t('welcomeModal.title');
  const subtitle = modalContent.content?.split('\n')[0] || t('welcomeModal.subtitle');
  const description = modalContent.content?.split('\n').slice(1).join('\n') || t('welcomeModal.description');
  const ctaText = t('welcomeModal.cta');
  const displayImage = modalImageData?.url || modalImage;

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  useEffect(() => {
    if (autoShow && !isControlled) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, delay, isControlled]);

  const handleEnter = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden border-0 shadow-2xl rounded-3xl">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 min-h-[550px]">
          {/* Left Column - Content with Cream Background */}
          <div className="p-10 md:p-14 flex flex-col justify-center" style={{ backgroundColor: '#F5F0E8' }}>
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={jwLogo} 
                alt="JWGROUP Logo" 
                className="h-20 md:h-24 w-auto"
              />
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#2D2D2D' }}>
              {title}
            </h2>

            {/* Subheadline in quotes */}
            <p className="text-xl md:text-2xl mb-6 font-medium" style={{ color: '#D4812A' }}>
              "{subtitle}"
            </p>

            {/* Description */}
            <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ color: '#4A4A4A' }}>
              {description}
            </p>

            {/* CTA Button - Orange */}
            <button
              onClick={handleEnter}
              className="w-fit px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ 
                backgroundColor: '#D4812A', 
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3C2A1E';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D4812A';
              }}
            >
              {ctaText}
            </button>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden md:block">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-50 rounded-lg p-2 bg-white hover:bg-gray-100 transition-colors shadow-lg"
              aria-label="Close"
            >
              <X className="h-5 w-5" style={{ color: '#2D2D2D' }} />
            </button>

            <img
              src={displayImage}
              alt={modalImageData?.alt || "JW Group Real Estate"}
              className="w-full h-full object-cover"
            />
            
            {/* ESC Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {t('welcomeModal.escHint')}
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-lg p-2 md:hidden"
            style={{ backgroundColor: '#F5F0E8' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" style={{ color: '#2D2D2D' }} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
