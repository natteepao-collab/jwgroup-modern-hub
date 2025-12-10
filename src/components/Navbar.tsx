import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, LogIn, LogOut, ChevronRight, ChevronDown, Home, Building2, Newspaper, Users, Phone, Info, Eye, Network, UserCircle, Award, Leaf } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import jwLogo from '@/assets/jw-group-logo-full.png';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteContent } from '@/hooks/useSiteContent';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const { getContent } = useSiteContent();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  // Get contact phone from database
  const phoneContent = getContent('contact_phone');
  const phoneNumber = phoneContent.content || '02-234-5678';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setAboutExpanded(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;
  const isAboutActive = location.pathname.startsWith('/about');

  const menuItems = [
    { path: '/', labelKey: 'nav.home', icon: Home },
    { path: '/business', labelKey: 'nav.business', icon: Building2 },
    { path: '/sustainability', labelKey: 'nav.sustainability', icon: Leaf },
    { path: '/news', labelKey: 'nav.news', icon: Newspaper },
    { path: '/careers', labelKey: 'nav.careers', icon: Users },
    { path: '/contact', labelKey: 'nav.contact', icon: Phone },
  ];

  const aboutSubItems = [
    { path: '/about/history', labelKey: 'about.history', icon: Info },
    { path: '/about/vision', labelKey: 'about.vision', icon: Eye },
    { path: '/about/structure', labelKey: 'about.structure', icon: Network },
    { path: '/about/team', labelKey: 'about.team', icon: UserCircle },
    { path: '/about/awards', labelKey: 'about.awards', icon: Award },
  ];

  // Determine if we need dark text (for light backgrounds when scrolled)
  const needsDarkText = isScrolled;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-card/95 backdrop-blur-md shadow-md'
            : 'bg-background/30 backdrop-blur-sm'
        )}
      >
        <div className="container mx-auto px-4">
          {/* Top Row - Logo, Language, Menu */}
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}>
            {/* Left - Empty for balance on desktop, Hamburger on mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "flex lg:hidden items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300",
                "hover:bg-foreground/10",
                isScrolled 
                  ? "text-foreground" 
                  : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              )}
            >
              <Menu className="h-6 w-6" strokeWidth={2.5} />
            </button>
            
            {/* Hidden spacer for desktop */}
            <div className="hidden lg:block w-24" />

            {/* Center - Logo */}
            <Link 
              to="/" 
              className={cn(
                "absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0",
                !isScrolled && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              )}
            >
              <img 
                src={jwLogo} 
                alt="JW Group" 
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "h-8 sm:h-10" : "h-10 sm:h-12"
                )}
              />
            </Link>

            {/* Right - Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              {/* Desktop Hamburger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  "hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                  "hover:bg-foreground/10",
                  isScrolled 
                    ? "text-foreground" 
                    : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                )}
              >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Bottom Row - Navigation Links (Desktop Only) */}
          <div className={cn(
            "hidden lg:flex items-center justify-center gap-8 border-t border-foreground/10 transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}>
            {/* About Us with Dropdown */}
            <div 
              ref={aboutDropdownRef}
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                className={cn(
                  "relative flex items-center gap-1 text-base font-bold tracking-wide transition-all duration-200 hover:text-primary",
                  "after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-primary after:transition-all after:duration-300",
                  aboutDropdownOpen || isAboutActive ? "after:w-full" : "after:w-0 hover:after:w-full",
                  isAboutActive ? "text-primary" : isScrolled ? "text-foreground" : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                )}
              >
                {t('nav.about')}
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  aboutDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200",
                  aboutDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
              >
                <div className="bg-card border border-border rounded-xl shadow-xl min-w-[220px] py-2 overflow-hidden">
                  {aboutSubItems.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        isActive(item.path) 
                          ? "text-primary bg-primary/5 font-bold" 
                          : "text-foreground/80"
                      )}
                    >
                      <item.icon className="h-4 w-4" strokeWidth={2} />
                      <span className="text-sm font-medium">{t(item.labelKey)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {menuItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative text-base font-bold tracking-wide transition-all duration-200 hover:text-primary",
                  "after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-primary after:transition-all after:duration-300",
                  isActive(item.path) ? "after:w-full" : "after:w-0 hover:after:w-full",
                  isActive(item.path) ? "text-primary" : isScrolled ? "text-foreground" : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Drawer Overlay Menu */}
      <div
        className={cn(
          'fixed inset-0 z-[100] transition-all duration-300',
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        )}
      >
        {/* Dark Backdrop */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/60 transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Panel - Slide from Left */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full w-[85%] max-w-[400px] bg-white/90 backdrop-blur-md shadow-2xl transition-transform duration-300 ease-out overflow-y-auto font-[\'Noto_Sans_Thai\']',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-foreground/10">
            <div className="px-5 py-4 flex items-center justify-between">
              <img src={jwLogo} alt="JW Group" className="h-8" />
              
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-5 py-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {/* Home */}
              <Link
                to="/"
                className={cn(
                  'flex items-center gap-4 py-4 px-4 rounded-xl transition-all duration-200',
                  'hover:bg-foreground/5',
                  isActive('/') ? 'text-primary' : 'text-foreground'
                )}
              >
                <Home className="h-5 w-5" strokeWidth={2} />
                <span className="text-base font-bold">{t('nav.home')}</span>
              </Link>

              {/* About Us - Expandable */}
              <div>
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className={cn(
                    'w-full flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-200',
                    'hover:bg-foreground/5',
                    isAboutActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Info className="h-5 w-5" strokeWidth={2} />
                    <span className="text-base font-bold">{t('nav.about')}</span>
                  </div>
                  <ChevronRight 
                    className={cn(
                      'h-5 w-5 transition-transform duration-300',
                      aboutExpanded && 'rotate-90'
                    )} 
                  />
                </button>

                {/* Submenu */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    aboutExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="ml-9 border-l border-foreground/20 space-y-1 py-1">
                    {aboutSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 py-3 px-4 transition-all duration-200',
                          'hover:bg-foreground/5 rounded-r-lg',
                          isActive(item.path) 
                            ? 'text-primary font-bold' 
                            : 'text-foreground/70 hover:text-foreground font-semibold'
                        )}
                      >
                        <item.icon className="h-4 w-4" strokeWidth={2} />
                        <span className="text-sm">{t(item.labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Menu Items */}
              {menuItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-200',
                    'hover:bg-foreground/5',
                    isActive(item.path) ? 'text-primary' : 'text-foreground'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                    <span className="text-base font-bold">{t(item.labelKey)}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-foreground/40" />
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-foreground/10" />

            {/* Admin & Auth Section */}
            <div className="space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-4 py-3 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
                >
                  <Shield className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm font-bold">Admin Panel</span>
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-foreground/70 hover:bg-foreground/5 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm font-bold">{t('nav.logout')}</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-4 py-3 px-4 rounded-xl text-foreground/70 hover:bg-foreground/5 transition-all duration-200"
                >
                  <LogIn className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm font-bold">{t('nav.login')}</span>
                </Link>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-10 px-4">
              <p className="text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">{t('nav.contactUs')}</p>
              <a 
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`} 
                className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
