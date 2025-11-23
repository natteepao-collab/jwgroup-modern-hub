import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold text-primary">JW</div>
              <div className="text-xl font-semibold">Group</div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {t('aboutSection.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about/history" className="text-sm hover:text-primary transition-colors">
                  {t('about.history')}
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-sm hover:text-primary transition-colors">
                  {t('nav.business')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm hover:text-primary transition-colors">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-primary transition-colors">
                  {t('nav.careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li>{t('contact.phone')}: +66 2 XXX XXXX</li>
              <li>{t('contact.email')}: info@jwgroup.com</li>
              <li>LINE: @jwgroup</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">{t('footer.copyright')}</div>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/pdpa" className="hover:text-primary transition-colors">
              {t('footer.pdpa')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
