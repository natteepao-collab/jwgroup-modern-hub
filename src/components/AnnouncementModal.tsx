import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
      <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-50 rounded-lg p-2 bg-card hover:bg-accent transition-colors shadow-lg"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Column - Content */}
          <div className="bg-card p-8 md:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={jwLogo} 
                alt="JWGROUP Logo" 
                className="h-16 md:h-20 w-auto"
              />
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t('welcomeModal.title')}
            </h2>

            {/* Description */}
            <p className="text-foreground/90 text-lg md:text-xl mb-8 leading-relaxed font-medium">
              {t('welcomeModal.description')}
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleEnter}
              size="lg"
              className="w-full md:w-auto px-8 py-6 text-lg font-semibold"
            >
              {t('welcomeModal.cta')}
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 hidden md:block">
            <img
              src={modalImage}
              alt="JW Group Real Estate"
              className="w-full h-full object-cover"
            />
            
            {/* ESC Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-muted-foreground">
              {t('welcomeModal.escHint')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
