import { useState } from 'react';
import { Phone, Mail, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const contacts = [
    {
      icon: Phone,
      label: 'Phone',
      href: 'tel:+6622XXXXXX',
      bgColor: 'bg-primary',
      hoverColor: 'hover:bg-primary/90'
    },
    {
      icon: MessageCircle,
      label: 'LINE',
      href: 'https://line.me/R/ti/p/@jwgroup',
      bgColor: 'bg-[#06C755]',
      hoverColor: 'hover:bg-[#06C755]/90'
    },
    {
      icon: MessageCircle,
      label: 'Facebook',
      href: 'https://m.me/jwgroup',
      bgColor: 'bg-[#0084FF]',
      hoverColor: 'hover:bg-[#0084FF]/90'
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:info@jwgroup.com',
      bgColor: 'bg-primary',
      hoverColor: 'hover:bg-primary/90'
    }
  ];

  return (
    <div className="fixed bottom-8 right-24 z-50 flex flex-col items-end gap-3">
      {/* Contact Buttons - Slide up from bottom */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-14 h-14 rounded-full ${contact.bgColor} ${contact.hoverColor} text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110`}
            aria-label={contact.label}
          >
            <contact.icon className="w-6 h-6" />
          </a>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingContact;
