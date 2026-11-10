import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, MessageCircle } from 'lucide-react';
import FAQChatbot from './FAQChatbot';
import { useSiteContent } from '@/hooks/useSiteContent';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { managedSocialLink } from '@/lib/publicContent';

const FloatingActions = () => {
  const { t } = useTranslation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { getContent } = useSiteContent();
  const lineUrl = managedSocialLink(getContent('social_line').content);


  useEffect(() => {
    const toggleVisibility = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <div className="site-floating-actions fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-center gap-3">
      <FAQChatbot />

      {/* LINE Official Account quick add */}
      {lineUrl && (
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('line_click', { label: 'fab' })}
          className="w-11 h-11 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={t('floating.line')}
          title={t('floating.line')}
        >
          <MessageCircle className="w-5 h-5" />

        </a>
      )}

      {showBackToTop && <Button
        onClick={scrollToTop}
        size="icon" variant="secondary"
        className="w-11 h-11 rounded-full shadow-lg"
        aria-label="Back to top"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>}
    </div>
  );
};

export default FloatingActions;
