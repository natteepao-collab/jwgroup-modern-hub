import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Cookie, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieSetting {
  id: string;
  setting_key: string;
  title_th: string | null;
  title_en: string | null;
  description_th: string | null;
  description_en: string | null;
  is_required: boolean;
  is_active: boolean;
  position_order: number;
}

// Context for cookie consent
interface CookieConsentContextType {
  openCookieSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
};

// Cookie popup component
const CookieConsentPopup = ({ 
  isVisible, 
  setIsVisible 
}: { 
  isVisible: boolean; 
  setIsVisible: (visible: boolean) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();

  // Fetch cookie settings from database
  const { data: cookieSettings } = useQuery({
    queryKey: ["cookie-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cookie_settings")
        .select("*")
        .eq("is_active", true)
        .order("position_order", { ascending: true });

      if (error) throw error;
      return data as CookieSetting[];
    },
  });

  // Get popup title and description
  const popupSettings = cookieSettings?.find(s => s.setting_key === "popup_title");
  const cookieTypes = cookieSettings?.filter(s => s.setting_key !== "popup_title") || [];

  // Load saved preferences when opening
  useEffect(() => {
    if (isVisible) {
      const saved = localStorage.getItem("cookie-consent");
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch {
          // ignore parse errors
        }
      }
    }
  }, [isVisible]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
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
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          role="region" aria-label={t('refinement.cookieTitle')}
          className="cookie-panel fixed bottom-24 left-3 right-3 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[101]"
        >

            <div className="bg-card rounded-lg shadow-xl overflow-hidden max-h-[70dvh] overflow-y-auto">
              {/* Header */}
              <div className="p-4 pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground">
                      {(i18n.language === 'th' ? popupSettings?.title_th : popupSettings?.title_en) || t('refinement.cookieTitle')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('refinement.cookieDescription')}
                    </p>
                  </div>
                </div>

              </div>

              {/* Content */}
              <div className="px-4 pb-4 pt-2">
                {/* Toggle Details Button */}
                <Button variant="ghost"
                  aria-expanded={showDetails} aria-controls="cookie-types"
                  onClick={() => setShowDetails(!showDetails)}
                  className="h-9 p-0 flex items-center gap-2 text-sm text-primary hover:bg-transparent mb-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t('refinement.settings')}</span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

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
                      <div id="cookie-types" className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                        {cookieTypes.map((cookie) => (
                          <div
                            key={cookie.id}
                            className="flex items-start justify-between gap-4 py-3 border-b border-border"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">
                                  {i18n.language === 'th' ? cookie.title_th : cookie.title_en || cookie.title_th}
                                </span>
                                {cookie.is_required && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {t('refinement.required')}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {cookie.description_th}
                              </p>
                            </div>
                            <Switch
                              aria-label={(i18n.language === 'th' ? cookie.title_th : cookie.title_en) || cookie.setting_key}
                              checked={preferences[cookie.setting_key as keyof CookiePreferences] ?? false}
                              onCheckedChange={(checked) =>
                                setPreferences((prev) => ({
                                  ...prev,
                                  [cookie.setting_key]: checked,
                                }))
                              }
                              disabled={cookie.is_required}
                              className="flex-shrink-0"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy Policy Link */}
                <p className="cookie-policy-links text-xs text-muted-foreground mb-3 flex flex-wrap gap-3">
                  <Button variant="link" size="sm"
                    onClick={() => {
                      setIsVisible(false);
                      navigate("/privacy");
                    }}
                    className="h-auto p-0 text-xs text-primary hover:underline"
                  >
                    {t('footer.privacy')}
                  </Button>
                  <Button variant="link" size="sm"
                    onClick={() => {
                      setIsVisible(false);
                      navigate("/pdpa");
                    }}
                    className="h-auto p-0 text-xs text-primary hover:underline"
                  >
                    {t('footer.pdpa')}
                  </Button>
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleDeclineAll}
                    variant="outline"
                    size="sm"
                    className="min-h-11 h-auto py-2 px-2 whitespace-normal text-sm"
                  >
                    {t('refinement.reject')}
                  </Button>
                  {showDetails && (
                    <Button
                      onClick={handleAcceptSelected}
                      variant="secondary"
                      size="sm"
                      className="col-span-2 min-h-11 h-auto whitespace-normal text-sm order-last"
                    >
                      {t('refinement.save')}
                    </Button>
                  )}
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    variant="outline" className="min-h-11 h-auto py-2 px-2 whitespace-normal text-sm"
                  >
                    {t('refinement.accept')}
                  </Button>
                </div>
              </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );
};

// Provider component
export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Auto-show on first visit
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const openCookieSettings = () => {
    setIsVisible(true);
  };

  return (
    <CookieConsentContext.Provider value={{ openCookieSettings }}>
      {children}
      <CookieConsentPopup isVisible={isVisible} setIsVisible={setIsVisible} />
    </CookieConsentContext.Provider>
  );
};

export default CookieConsentProvider;
