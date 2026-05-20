import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import FAQChatbot from './FAQChatbot';
import { useSiteContent } from '@/hooks/useSiteContent';
import { trackEvent } from '@/lib/analytics';

const FloatingActions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { getContent } = useSiteContent();
  const lineUrl = (getContent('social_line').content || '').trim();

  useEffect(() => {
    const toggleVisibility = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <FAQChatbot />

      {/* LINE Official Account quick add */}
      {lineUrl && (
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('line_click', { label: 'fab' })}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06C755] to-[#00B900] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-1"
          aria-label="Add LINE Official"
          title="แอด LINE Official"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      )}

      <button
        onClick={scrollToTop}
        className={`w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingActions;
