import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Cookie } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useCookieConsent } from '@/components/CookieConsent';
import jwLogo from '@/assets/jw-group-logo-full.png';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  const { t } = useTranslation();
  const { getContent } = useSiteContent();
  const { openCookieSettings } = useCookieConsent();

  // Get contact data from database
  const addressContent = getContent('contact_address');
  const phoneContent = getContent('contact_phone');
  const emailContent = getContent('contact_email');
  const hoursContent = getContent('contact_hours');

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4 bg-background/95 p-3 rounded-xl shadow-sm">
              <img src={jwLogo} alt="JW Group" width="1754" height="1241" className="h-10 w-auto" />
            </Link>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">
              {t('footer.companyDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about/history" className="text-sm hover:text-primary transition-colors inline-block">
                  {t('about.history')}
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-sm hover:text-primary transition-colors inline-block">
                  {t('nav.business')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm hover:text-primary transition-colors inline-block">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-primary transition-colors inline-block">
                  {t('nav.careers')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-colors inline-block">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="opacity-90">
                  {addressContent.content || t('footer.address')}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`tel:${phoneContent.content?.replace(/\s/g, '') || '+6622345678'}`}
                  className="hover:text-primary transition-colors opacity-90"
                >
                  {phoneContent.content || '+66 2 234 5678'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${emailContent.content || 'info@jwgroup.com'}`}
                  className="hover:text-primary transition-colors opacity-90"
                >
                  {emailContent.content || 'info@jwgroup.com'}
                </a>
              </li>
              <li className="opacity-90">LINE: @jwgroup</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="text-sm opacity-90">
              <p className="mb-2 font-semibold">{t('footer.businessHours')}</p>
              <p>{hoursContent.content || t('footer.hours')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">© 2026 JW Group. สงวนลิขสิทธิ์</div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/pdpa" className="hover:text-primary transition-colors">
              {t('footer.pdpa')}
            </Link>
            <button
              onClick={openCookieSettings}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Cookie className="h-3.5 w-3.5" />
              ตั้งค่าคุกกี้
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
