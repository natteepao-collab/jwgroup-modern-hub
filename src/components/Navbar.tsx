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
                  "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out",
                  aboutDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3"
                )}
              >
                {/* Arrow indicator */}
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-border rotate-45 z-10" />
                
                <div className="relative bg-card border border-border rounded-2xl shadow-2xl min-w-[260px] py-3 overflow-hidden">
                  {/* Subtle gradient header */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                  
                  {aboutSubItems.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center gap-4 px-5 py-3.5 mx-2 rounded-xl transition-all duration-200",
                        "hover:bg-primary/10",
                        isActive(item.path) 
                          ? "text-primary bg-primary/10 font-bold" 
                          : "text-foreground/70 hover:text-primary"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                        isActive(item.path) 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted group-hover:bg-primary/20 group-hover:text-primary"
                      )}>
                        <item.icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <span className="text-[15px] font-bold tracking-widest leading-relaxed">{t(item.labelKey)}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 ml-auto opacity-0 -translate-x-2 transition-all duration-200",
                        "group-hover:opacity-100 group-hover:translate-x-0",
                        isActive(item.path) && "opacity-100 translate-x-0"
                      )} />
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
          <div className="px-4 py-6">
            {/* Gradient accent line */}
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6" />
            
            {/* Main Navigation */}
            <nav className="space-y-1.5">
              {/* Home */}
              <Link
                to="/"
                className={cn(
                  'group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200',
                  'hover:bg-primary/10',
                  isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground'
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                  isActive('/') 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-muted group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <Home className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="text-[17px] font-bold tracking-widest leading-relaxed flex-1">{t('nav.home')}</span>
                <ChevronRight className={cn(
                  "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200",
                  "group-hover:opacity-70 group-hover:translate-x-0",
                  isActive('/') && "opacity-70 translate-x-0"
                )} />
              </Link>

              {/* About Us - Expandable */}
              <div className="overflow-hidden rounded-xl">
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className={cn(
                    'group w-full flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200',
                    'hover:bg-primary/10',
                    isAboutActive ? 'text-primary bg-primary/10' : 'text-foreground'
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                    isAboutActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted group-hover:bg-primary/20 group-hover:text-primary"
                  )}>
                    <Info className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="text-[17px] font-bold tracking-widest leading-relaxed flex-1 text-left">{t('nav.about')}</span>
                  <ChevronDown 
                    className={cn(
                      'h-5 w-5 transition-transform duration-300',
                      aboutExpanded && 'rotate-180'
                    )} 
                  />
                </button>

                {/* Submenu */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    aboutExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="ml-4 mt-1 mb-2 space-y-1 bg-muted/50 rounded-xl p-2">
                    {aboutSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'group flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200',
                          'hover:bg-primary/10',
                          isActive(item.path) 
                            ? 'text-primary bg-primary/10 font-bold' 
                            : 'text-foreground/70 hover:text-primary'
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                          isActive(item.path) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                          <item.icon className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <span className="text-[15px] font-bold tracking-widest leading-relaxed">{t(item.labelKey)}</span>
                        <ChevronRight className={cn(
                          "h-4 w-4 ml-auto opacity-0 -translate-x-2 transition-all duration-200",
                          "group-hover:opacity-70 group-hover:translate-x-0",
                          isActive(item.path) && "opacity-70 translate-x-0"
                        )} />
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
                    'group flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200',
                    'hover:bg-primary/10',
                    isActive(item.path) ? 'text-primary bg-primary/10' : 'text-foreground'
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted group-hover:bg-primary/20 group-hover:text-primary"
                  )}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="text-[17px] font-bold tracking-widest leading-relaxed flex-1">{t(item.labelKey)}</span>
                  <ChevronRight className={cn(
                    "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200",
                    "group-hover:opacity-70 group-hover:translate-x-0",
                    isActive(item.path) && "opacity-70 translate-x-0"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

            {/* Admin & Auth Section */}
            <div className="space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 transition-all duration-200 border border-primary/20"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Shield className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span className="text-[15px] font-bold tracking-widest leading-relaxed">Admin Panel</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="group w-full flex items-center gap-4 py-3 px-4 rounded-xl text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted group-hover:bg-destructive/20 transition-all duration-200">
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span className="text-[15px] font-bold tracking-widest leading-relaxed">{t('nav.logout')}</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="group flex items-center gap-4 py-3 px-4 rounded-xl text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted group-hover:bg-primary/20 transition-all duration-200">
                    <LogIn className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span className="text-[15px] font-bold tracking-widest leading-relaxed">{t('nav.login')}</span>
                </Link>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10">
              <p className="text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">{t('nav.contactUs')}</p>
              <a 
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center gap-3 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <Phone className="h-5 w-5" strokeWidth={2} />
                </div>
                {phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
