import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Phone, MapPin, Calendar, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const contactOptions = [
    {
      icon: Phone,
      label: "Call Center",
      sublabel: "โทร 02-XXX-XXXX",
      action: () => window.open("tel:02-xxx-xxxx"),
    },
    {
      icon: MapPin,
      label: "Dealer",
      sublabel: "ค้นหาตัวแทนใกล้คุณ",
      action: () => setIsOpen(false),
    },
    {
      icon: Calendar,
      label: t('contactModal.appointment'),
      sublabel: "นัดหมายเข้าชมโครงการ",
      action: () => setIsOpen(false),
    },
    {
      icon: MessageCircle,
      label: "Chat Sales",
      sublabel: "แชทกับเจ้าหน้าที่",
      action: () => window.open("https://line.me/ti/p/@jwgroup", "_blank"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden border-0 bg-card shadow-2xl rounded-3xl">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-50 rounded-full p-1.5 bg-background/90 hover:bg-background transition-colors shadow-lg"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        {/* Contact Options */}
        <div className="py-6">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.action}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-accent/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground text-base">
                    {option.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />
      </DialogContent>
    </Dialog>
  );
};
