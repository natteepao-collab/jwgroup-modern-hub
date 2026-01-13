import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const cookieTypes = [
    {
      id: "necessary",
      title: "คุกกี้ที่จำเป็น",
      titleEn: "Necessary Cookies",
      description: "คุกกี้เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้",
      required: true,
    },
    {
      id: "analytics",
      title: "คุกกี้วิเคราะห์",
      titleEn: "Analytics Cookies",
      description: "ช่วยให้เราเข้าใจวิธีการใช้งานเว็บไซต์ของผู้เยี่ยมชม",
      required: false,
    },
    {
      id: "marketing",
      title: "คุกกี้การตลาด",
      titleEn: "Marketing Cookies",
      description: "ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ",
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => {}}
          />

          {/* Cookie Popup */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-lg z-[101]"
          >
            <div className="bg-card border border-border rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Cookie className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      🍪 เราใช้คุกกี้
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {/* Toggle Details Button */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
                >
                  <Shield className="w-4 h-4" />
                  <span>ตั้งค่าความเป็นส่วนตัว</span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Cookie Details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                        {cookieTypes.map((cookie) => (
                          <div
                            key={cookie.id}
                            className="flex items-start justify-between gap-4 p-3 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">
                                  {cookie.title}
                                </span>
                                {cookie.required && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    จำเป็น
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {cookie.description}
                              </p>
                            </div>
                            <Switch
                              checked={preferences[cookie.id as keyof CookiePreferences]}
                              onCheckedChange={(checked) =>
                                setPreferences((prev) => ({
                                  ...prev,
                                  [cookie.id]: checked,
                                }))
                              }
                              disabled={cookie.required}
                              className="flex-shrink-0"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy Policy Link */}
                <p className="text-xs text-muted-foreground mb-4">
                  อ่านเพิ่มเติมได้ที่{" "}
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      navigate("/privacy");
                    }}
                    className="text-primary hover:underline"
                  >
                    นโยบายความเป็นส่วนตัว
                  </button>{" "}
                  และ{" "}
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      navigate("/pdpa");
                    }}
                    className="text-primary hover:underline"
                  >
                    นโยบาย PDPA
                  </button>
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleDeclineAll}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-sm"
                  >
                    ปฏิเสธทั้งหมด
                  </Button>
                  {showDetails && (
                    <Button
                      onClick={handleAcceptSelected}
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-sm"
                    >
                      บันทึกการตั้งค่า
                    </Button>
                  )}
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="flex-1 text-sm bg-primary hover:bg-primary/90"
                  >
                    ยอมรับทั้งหมด
                  </Button>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
