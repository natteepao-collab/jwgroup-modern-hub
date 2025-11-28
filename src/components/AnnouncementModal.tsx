import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import jwGroupLogo from "@/assets/jw-group-logo.png";

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-0 bg-background shadow-2xl rounded-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 hover:bg-background transition-colors shadow-md"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        {/* Logo Section */}
        <div className="flex justify-center pt-8 pb-6 px-8 bg-gradient-to-b from-primary/5 to-transparent">
          <img
            src={jwGroupLogo}
            alt="JW GROUP Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="px-8 pb-8 pt-4">
          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              ยินดีต้อนรับสู่ JW Group
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              กลุ่มธุรกิจครบวงจร ผู้นำด้านอสังหาริมทรัพย์ โรงแรม สัตวแพทย์ และสุขภาพ
              พร้อมมอบประสบการณ์ระดับพรีเมียมให้กับคุณ
            </DialogDescription>
          </DialogHeader>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setIsOpen(false)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8"
            >
              สำรวจธุรกิจของเรา
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-300 px-8"
            >
              ติดต่อเรา
            </Button>
          </div>
        </div>

        {/* Bottom Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />
      </DialogContent>
    </Dialog>
  );
};
