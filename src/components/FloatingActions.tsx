import { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, X, ArrowUp } from 'lucide-react';

const FloatingActions = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:info@jwgroup.com',
      bgColor: 'bg-primary',
    },
    {
      icon: MessageCircle,
      label: 'Facebook',
      href: 'https://m.me/jwgroup',
      bgColor: 'bg-[#0084FF]',
    },
    {
      icon: MessageCircle,
      label: 'LINE',
      href: 'https://line.me/R/ti/p/@jwgroup',
      bgColor: 'bg-[#06C755]',
    },
    {
      icon: Phone,
      label: 'Phone',
      href: 'tel:+6622XXXXXX',
      bgColor: 'bg-primary',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Contact Options - Slide up */}
      <div className={`flex flex-col gap-2 transition-all duration-300 ease-out ${
        isContactOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full ${contact.bgColor} text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1`}
            style={{ transitionDelay: isContactOpen ? `${index * 50}ms` : '0ms' }}
            aria-label={contact.label}
          >
            <contact.icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Main Contact Toggle Button */}
      <button
        onClick={() => setIsContactOpen(!isContactOpen)}
        className={`w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 ${
          isContactOpen 
            ? 'rotate-45 bg-muted-foreground hover:bg-muted-foreground/80' 
            : 'hover:scale-110 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1'
        }`}
        aria-label={isContactOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        {isContactOpen ? <X className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
      </button>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 ${
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
