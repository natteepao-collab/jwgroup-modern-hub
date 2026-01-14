import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, LogIn, LogOut, ChevronRight, ChevronDown, Home, Building2, Newspaper, Users, Phone, Info, Eye, Network, UserCircle, Award, Leaf, Facebook, Instagram, Youtube } from 'lucide-react';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
import { LanguageSwitcher } from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import jwLogo from '@/assets/jw-group-logo-full.png';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useSocialLinks } from '@/hooks/useSocialLinks';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const { getContent } = useSiteContent();
  const { links: socialLinks } = useSocialLinks();
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
            ? 'bg-card/80 backdrop-blur-xl shadow-sm border-b border-white/20'
            : 'bg-background/20 backdrop-blur-lg border-b border-white/10'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Top Row - Responsive Layout */}
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 transition-all duration-300",
            isScrolled ? "py-2 sm:py-2" : "py-3 sm:py-3"
          )}>
            {/* Mobile: Logo + Hamburger Row */}
            <div className="flex sm:hidden w-full items-center justify-between">
              <button
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  "flex items-center justify-center gap-2 h-11 px-4 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                  "shadow-lg shadow-primary/25 border border-primary-foreground/10",
                  "hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95",
                  "btn-ripple btn-shimmer"
                )}
              >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
                <span className="text-sm font-extrabold tracking-widest uppercase">Menu</span>
              </button>

              {/* Center - Logo */}
              <Link
                to="/"
                className={cn(
                  !isScrolled && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                )}
              >
                <img
                  src={jwLogo}
                  alt="JW Group"
                  width="1754"
                  height="1241"
                  className={cn(
                    "transition-all duration-300 w-auto",
                    isScrolled ? "h-8" : "h-10"
                  )}
                />
              </Link>

              {/* Right - Theme & Language */}
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile: Social Media Icons Row */}
            <div className="flex sm:hidden w-full items-center justify-center gap-2 pb-1">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                  "border border-border/50 shadow-sm social-icon-animate btn-press",
                  "hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30"
                )}
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-[#1877F2] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                  "border border-border/50 shadow-sm social-icon-animate btn-press",
                  "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B] hover:scale-110 hover:shadow-lg hover:shadow-[#E4405F]/30"
                )}
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-[#E4405F] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                  "border border-border/50 shadow-sm social-icon-animate btn-press",
                  "hover:bg-foreground hover:border-foreground hover:scale-110 hover:shadow-lg hover:shadow-foreground/30"
                )}
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4 text-foreground group-hover:text-background transition-colors duration-300" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                  "border border-border/50 shadow-sm social-icon-animate btn-press",
                  "hover:bg-[#FF0000] hover:border-[#FF0000] hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/30"
                )}
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-[#FF0000] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
              </a>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex w-full items-center justify-between relative">
              {/* Left - Hamburger (Mobile) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  "flex lg:hidden items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300",
                  "hover:bg-foreground/10",
                  isScrolled
                    ? "text-foreground"
                    : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                )}
              >
                <Menu className="h-6 w-6" strokeWidth={2.5} />
              </button>

              {/* Hidden spacer for desktop distribution - kept for left side balance if needed, though absolute centering ignores it */}
              <div className="hidden lg:block w-24" />

              {/* Center - Logo */}
              <Link
                to="/"
                className={cn(
                  "absolute left-1/2 -translate-x-1/2",
                  !isScrolled && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                )}
              >
                <img
                  src={jwLogo}
                  alt="JW Group"
                  width="1754"
                  height="1241"
                  className={cn(
                    "transition-all duration-300 w-auto",
                    isScrolled ? "h-10" : "h-12"
                  )}
                />
              </Link>

              {/* Right - Actions */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Social Media Icons - Premium Glassmorphic Style */}
                <div className="flex items-center gap-2">
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                      "border border-border/50 shadow-sm social-icon-animate btn-press",
                      "hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30"
                    )}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-[#1877F2] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                      "border border-border/50 shadow-sm social-icon-animate btn-press",
                      "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B] hover:scale-110 hover:shadow-lg hover:shadow-[#E4405F]/30"
                    )}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-[#E4405F] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  </a>
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                      "border border-border/50 shadow-sm social-icon-animate btn-press",
                      "hover:bg-foreground hover:border-foreground hover:scale-110 hover:shadow-lg hover:shadow-foreground/30"
                    )}
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="h-5 w-5 text-foreground group-hover:text-background transition-colors duration-300" />
                  </a>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                      "border border-border/50 shadow-sm social-icon-animate btn-press",
                      "hover:bg-[#FF0000] hover:border-[#FF0000] hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/30"
                    )}
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5 text-[#FF0000] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  </a>
                </div>

                <div className="w-px h-6 bg-border/50 mx-1" />

                <ThemeToggle />
                <LanguageSwitcher />
                {/* Desktop Hamburger - Premium Style */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={cn(
                    "hidden lg:flex items-center justify-center gap-2 h-11 px-5 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                    "shadow-lg shadow-primary/25 border border-primary-foreground/10",
                    "hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95",
                    "btn-ripple btn-shimmer"
                  )}
                >
                  <Menu className="h-5 w-5" strokeWidth={2.5} />
                  <span className="text-sm font-extrabold tracking-widest uppercase">Menu</span>
                </button>
              </div>
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
                  "relative flex items-center gap-1.5 text-[15px] font-semibold tracking-wide transition-all duration-300",
                  aboutDropdownOpen || isAboutActive ? "text-primary" : "text-foreground/80 hover:text-primary"
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

                <div className="relative bg-card border border-border rounded-2xl shadow-2xl min-w-[280px] py-4 overflow-hidden">
                  {/* Subtle gradient header */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                  {aboutSubItems.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center gap-5 px-6 py-4 mx-3 rounded-xl transition-all duration-200",
                        "hover:bg-primary/10",
                        isActive(item.path)
                          ? "text-primary bg-primary/10 font-bold"
                          : "text-foreground/70 hover:text-primary"
                      )}
                    >
                      <div className={cn(
                        "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 overflow-hidden",
                        isActive(item.path)
                          ? "bg-[#FCD34D] text-black shadow-lg shadow-yellow-400/30" // Active: Yellow-300/400
                          : "bg-[#FCD34D] text-black/80 group-hover:text-black group-hover:scale-110 group-hover:shadow-md" // Inactive: Yellow-300
                      )}>
                        {/* Decorative translucent shape for depth */}
                        <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-white/30 rounded-full blur-[2px]" />

                        <item.icon className="relative h-4 w-4 z-10" strokeWidth={2} />
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
                  "relative text-[15px] font-semibold tracking-wide transition-all duration-300",
                  isActive(item.path)
                    ? "text-primary after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-foreground/80 hover:text-primary hover:after:content-[''] hover:after:absolute hover:after:-bottom-1 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-primary/50 hover:after:rounded-full"
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
              <img src={jwLogo} alt="JW Group" width="1754" height="1241" className="h-8 w-auto" />

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
                  'group flex items-center gap-5 py-4 px-5 rounded-xl transition-all duration-200',
                  'hover:bg-primary/10',
                  isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground',
                  isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                )}
                style={{ animationDelay: '100ms', animationFillMode: 'both' }}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-105",
                  isActive('/')
                    ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/40"
                    : "bg-gradient-to-br from-muted via-muted to-muted/80 border border-border/50 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                )}>
                  <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                  {isActive('/') && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/20 to-transparent" />
                  )}
                </div>
                <span className="text-[17px] font-bold tracking-widest leading-relaxed flex-1">{t('nav.home')}</span>
                <ChevronRight className={cn(
                  "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300",
                  "group-hover:opacity-70 group-hover:translate-x-0",
                  isActive('/') && "opacity-70 translate-x-0"
                )} />
              </Link>

              {/* About Us - Expandable */}
              <div
                className={cn(
                  "overflow-hidden rounded-xl",
                  isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                )}
                style={{ animationDelay: '150ms', animationFillMode: 'both' }}
              >
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className={cn(
                    'group w-full flex items-center gap-5 py-4 px-5 rounded-xl transition-all duration-200',
                    'hover:bg-primary/10',
                    isAboutActive ? 'text-primary bg-primary/10' : 'text-foreground'
                  )}
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-105",
                    isAboutActive
                      ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/40"
                      : "bg-gradient-to-br from-muted via-muted to-muted/80 border border-border/50 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                  )}>
                    <Info className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    {isAboutActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/20 to-transparent" />
                    )}
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
                  <div className="ml-4 mt-2 mb-2 space-y-1.5 bg-muted/50 rounded-xl p-3">
                    {aboutSubItems.map((item, subIndex) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'group flex items-center gap-4 py-3.5 px-4 rounded-lg transition-all duration-200',
                          'hover:bg-primary/10',
                          isActive(item.path)
                            ? 'text-primary bg-primary/10 font-bold'
                            : 'text-foreground/70 hover:text-primary',
                          aboutExpanded ? 'animate-fade-in opacity-100' : 'opacity-0'
                        )}
                        style={{ animationDelay: `${subIndex * 50}ms`, animationFillMode: 'both' }}
                      >
                        <div className={cn(
                          "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-105",
                          isActive(item.path)
                            ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-gradient-to-br from-background via-background to-muted/50 border border-border/40 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 group-hover:border-primary/30 group-hover:text-primary"
                        )}>
                          <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                          {isActive(item.path) && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/20 to-transparent" />
                          )}
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
              {menuItems.slice(1).map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'group flex items-center gap-5 py-4 px-5 rounded-xl transition-all duration-200',
                    'hover:bg-primary/10',
                    isActive(item.path) ? 'text-primary bg-primary/10' : 'text-foreground',
                    isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                  )}
                  style={{ animationDelay: `${200 + (index * 50)}ms`, animationFillMode: 'both' }}
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-105",
                    isActive(item.path)
                      ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/40"
                      : "bg-gradient-to-br from-muted via-muted to-muted/80 border border-border/50 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                  )}>
                    <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    {isActive(item.path) && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/20 to-transparent" />
                    )}
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
            <div
              className={cn(
                "space-y-3",
                isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
              )}
              style={{ animationDelay: '450ms', animationFillMode: 'both' }}
            >
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group relative flex items-center gap-4 py-4 px-5 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary hover:from-primary/25 hover:via-primary/20 hover:to-primary/15 transition-all duration-300 border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/40 group-hover:scale-105 transition-transform duration-300">
                    <Shield className="h-5 w-5" strokeWidth={2} />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/20 to-transparent" />
                  </div>
                  <span className="relative text-[16px] font-bold tracking-widest leading-relaxed">Admin Panel</span>
                  <ChevronRight className="relative h-5 w-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="group relative w-full flex items-center gap-4 py-4 px-5 rounded-2xl overflow-hidden text-foreground/70 hover:text-destructive transition-all duration-300 border border-transparent hover:border-destructive/30 hover:bg-gradient-to-r hover:from-destructive/10 hover:via-destructive/5 hover:to-transparent"
                >
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-muted via-muted to-muted/80 border border-border/50 group-hover:from-destructive/20 group-hover:via-destructive/15 group-hover:to-destructive/10 group-hover:border-destructive/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-destructive/20">
                    <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                  </div>
                  <span className="text-[16px] font-bold tracking-widest leading-relaxed">{t('nav.logout')}</span>
                  <ChevronRight className="h-5 w-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="group relative flex items-center gap-4 py-4 px-5 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-foreground/70 hover:text-primary transition-all duration-300 border border-primary/20 hover:border-primary/40 hover:from-primary/20 hover:via-primary/15 hover:to-primary/5 hover:shadow-lg hover:shadow-primary/15"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-muted via-muted to-muted/80 border border-border/50 group-hover:from-primary/25 group-hover:via-primary/20 group-hover:to-primary/15 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25">
                    <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                  </div>
                  <span className="relative text-[16px] font-bold tracking-widest leading-relaxed">{t('nav.login')}</span>
                  <ChevronRight className="relative h-5 w-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              )}
            </div>

            {/* Contact Info */}
            <div
              className={cn(
                "mt-8 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10",
                isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
              )}
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
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
