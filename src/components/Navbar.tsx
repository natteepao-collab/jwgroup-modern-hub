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
    { path: '/vision-mission', labelKey: 'nav.visionMission', icon: Eye },
    { path: '/news', labelKey: 'nav.news', icon: Newspaper },
    { path: '/careers', labelKey: 'nav.careers', icon: Users },
    { path: '/contact', labelKey: 'nav.contact', icon: Phone },
  ];

  const aboutSubItems = [
    { path: '/about/history', labelKey: 'about.history', icon: Info },
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
                  "flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:h-11 sm:px-4 rounded-full transition-all duration-300",
                  "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                  "shadow-lg shadow-primary/25 border border-primary-foreground/10",
                  "hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95",
                  "btn-ripple btn-shimmer"
                )}
              >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
                <span className="hidden sm:inline text-sm font-extrabold tracking-widest uppercase">Menu</span>
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

            {/* Mobile Only: Social Media Icons Row */}
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

            {/* Tablet Layout (sm to lg) - Single Row */}
            <div className="hidden sm:flex lg:hidden w-full items-center justify-between">
              {/* Left - Logo */}
              <Link
                to="/"
                className={cn(
                  "shrink-0",
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

              {/* Center - Social Icons */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                    "border border-border/50 shadow-sm social-icon-animate btn-press",
                    "hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30"
                  )}
                  aria-label="Facebook"
                >
                  <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#1877F2] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                    "border border-border/50 shadow-sm social-icon-animate btn-press",
                    "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B] hover:scale-110 hover:shadow-lg hover:shadow-[#E4405F]/30"
                  )}
                  aria-label="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#E4405F] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </a>
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                    "border border-border/50 shadow-sm social-icon-animate btn-press",
                    "hover:bg-foreground hover:border-foreground hover:scale-110 hover:shadow-lg hover:shadow-foreground/30"
                  )}
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-foreground group-hover:text-background transition-colors duration-300" />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm",
                    "border border-border/50 shadow-sm social-icon-animate btn-press",
                    "hover:bg-[#FF0000] hover:border-[#FF0000] hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/30"
                  )}
                  aria-label="YouTube"
                >
                  <Youtube className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#FF0000] group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </a>
              </div>

              {/* Right - Theme, Language, Menu */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
                
                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={cn(
                    "flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                    "shadow-lg shadow-primary/25 border border-primary-foreground/10",
                    "hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95",
                    "btn-ripple btn-shimmer"
                  )}
                >
                  <Menu className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Desktop Layout (lg and up) */}
            <div className="hidden lg:flex w-full items-center justify-between relative">
              {/* Left - Spacer for balance */}
              <div className="w-24" />

              {/* Center - Logo */}
              <Link
                to="/"
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 z-10",
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

              {/* Right - Theme, Language, Menu */}
              <div className="flex items-center gap-3">
                {/* Theme & Language */}
                <ThemeToggle />
                <LanguageSwitcher />
                
                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={cn(
                    "flex items-center justify-center gap-2 h-11 px-5 rounded-full transition-all duration-300",
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

          {/* Bottom Row - Navigation Links + Social Icons (Desktop Only) */}
          <div className={cn(
            "hidden lg:flex items-center justify-between border-t border-foreground/10 transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}>
            {/* Left - Spacer for balance */}
            <div className="w-40" />

            {/* Center - Navigation Links */}
            <div className="flex items-center justify-center gap-8">
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
                          "group flex items-center gap-4 px-5 py-3.5 mx-3 rounded-xl transition-all duration-300",
                          "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                          isActive(item.path)
                            ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5"
                            : "text-foreground/80 hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 overflow-hidden",
                          isActive(item.path)
                            ? "bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-lg shadow-primary/40 scale-105"
                            : "bg-gradient-to-br from-secondary/90 to-secondary/70 text-secondary-foreground group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
                        )}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                          <item.icon className="relative h-5 w-5 z-10" strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className={cn(
                            "text-[14px] font-bold tracking-wide leading-tight transition-colors duration-300",
                            isActive(item.path) ? "text-primary" : "text-foreground group-hover:text-primary"
                          )}>{t(item.labelKey)}</span>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 ml-auto transition-all duration-300 text-muted-foreground",
                          "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary",
                          isActive(item.path) && "opacity-100 translate-x-0 text-primary"
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

            {/* Right - Social Icons */}
            <div className="flex items-center gap-2">
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
            "absolute top-0 left-0 h-full w-[85%] max-w-[400px] bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out overflow-y-auto font-['Noto_Sans_Thai']",
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Premium Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-secondary via-secondary to-secondary/95 backdrop-blur-sm border-b border-primary/20">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="p-2 bg-card/95 rounded-xl shadow-lg">
                <img src={jwLogo} alt="JW Group" width="1754" height="1241" className="h-8 w-auto" />
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card/20 text-secondary-foreground hover:bg-card/30 transition-all duration-300 hover:scale-105"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-6">
            {/* Premium Header Label */}
            <div className="mb-6 relative">
              <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/30 rounded-full" />
              <h3 className="text-lg font-bold text-foreground mb-1 pl-4">เมนู</h3>
              <p className="text-xs text-muted-foreground pl-4">JW Group Navigation</p>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-2.5">
              {/* Home */}
              <Link
                to="/"
                className={cn(
                  "group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm",
                  isActive('/')
                    ? "bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border-primary/30 shadow-xl shadow-primary/15"
                    : "bg-card/80 border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                )}
                style={{ animationDelay: '100ms', animationFillMode: 'both' }}
              >
                {/* Premium Icon Container */}
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                  isActive('/')
                    ? "bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 scale-105"
                    : "bg-gradient-to-br from-muted to-muted/70 group-hover:from-primary group-hover:to-accent group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                  <Home className={cn(
                    "relative h-5 w-5 z-10 transition-all duration-300",
                    isActive('/') ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary-foreground"
                  )} strokeWidth={1.8} />
                  {isActive('/') && (
                    <span className="absolute inset-0 rounded-xl ring-2 ring-primary-foreground/20 animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  "text-[15px] font-bold tracking-wide transition-colors duration-300 flex-1",
                  isActive('/') ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                )}>
                  {t('nav.home')}
                </span>

                {/* Arrow */}
                <ChevronRight className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive('/') ? "opacity-100 text-primary translate-x-0" : "opacity-0 text-muted-foreground -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
                )} />

                {/* Active indicator bar */}
                {isActive('/') && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                )}
              </Link>

              {/* About Us - Expandable */}
              <div
                className={cn(
                  "overflow-hidden rounded-2xl",
                  isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                )}
                style={{ animationDelay: '150ms', animationFillMode: 'both' }}
              >
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className={cn(
                    "group relative w-full flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm",
                    isAboutActive
                      ? "bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border-primary/30 shadow-xl shadow-primary/15"
                      : "bg-card/80 border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  {/* Premium Icon Container */}
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                    isAboutActive
                      ? "bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 scale-105"
                      : "bg-gradient-to-br from-muted to-muted/70 group-hover:from-primary group-hover:to-accent group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                    <Info className={cn(
                      "relative h-5 w-5 z-10 transition-all duration-300",
                      isAboutActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary-foreground"
                    )} strokeWidth={1.8} />
                    {isAboutActive && (
                      <span className="absolute inset-0 rounded-xl ring-2 ring-primary-foreground/20 animate-pulse" />
                    )}
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-[15px] font-bold tracking-wide transition-colors duration-300 flex-1 text-left",
                    isAboutActive ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                  )}>
                    {t('nav.about')}
                  </span>

                  {/* Chevron */}
                  <ChevronDown className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isAboutActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                    aboutExpanded && "rotate-180"
                  )} />

                  {/* Active indicator bar */}
                  {isAboutActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                  )}
                </button>

                {/* Premium Submenu */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    aboutExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="ml-4 mt-2 mb-2 space-y-2 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 rounded-2xl p-3 border border-primary/15">
                    {aboutSubItems.map((item, subIndex) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "group relative flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 border backdrop-blur-sm",
                          isActive(item.path)
                            ? "bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border-primary/30 shadow-lg shadow-primary/10"
                            : "bg-card/60 border-transparent hover:bg-card hover:border-primary/20 hover:shadow-md",
                          aboutExpanded ? 'animate-fade-in opacity-100' : 'opacity-0'
                        )}
                        style={{ animationDelay: `${subIndex * 50}ms`, animationFillMode: 'both' }}
                      >
                        {/* Submenu Icon */}
                        <div className={cn(
                          "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 overflow-hidden",
                          isActive(item.path)
                            ? "bg-gradient-to-br from-primary via-primary to-accent shadow-md shadow-primary/30"
                            : "bg-gradient-to-br from-muted/80 to-muted/50 group-hover:from-primary group-hover:to-accent group-hover:shadow-md group-hover:shadow-primary/20 group-hover:scale-105"
                        )}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/15" />
                          <item.icon className={cn(
                            "relative h-4 w-4 z-10 transition-all duration-300",
                            isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary-foreground"
                          )} strokeWidth={1.8} />
                        </div>

                        {/* Submenu Label */}
                        <span className={cn(
                          "text-[14px] font-bold tracking-wide transition-colors duration-300",
                          isActive(item.path) ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                        )}>
                          {t(item.labelKey)}
                        </span>

                        {/* Arrow */}
                        <ChevronRight className={cn(
                          "h-4 w-4 ml-auto transition-all duration-300",
                          isActive(item.path) ? "opacity-100 text-primary translate-x-0" : "opacity-0 text-muted-foreground -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
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
                    "group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border-primary/30 shadow-xl shadow-primary/15"
                      : "bg-card/80 border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                    isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
                  )}
                  style={{ animationDelay: `${200 + (index * 50)}ms`, animationFillMode: 'both' }}
                >
                  {/* Premium Icon Container */}
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                    isActive(item.path)
                      ? "bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 scale-105"
                      : "bg-gradient-to-br from-muted to-muted/70 group-hover:from-primary group-hover:to-accent group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                    <item.icon className={cn(
                      "relative h-5 w-5 z-10 transition-all duration-300",
                      isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary-foreground"
                    )} strokeWidth={1.8} />
                    {isActive(item.path) && (
                      <span className="absolute inset-0 rounded-xl ring-2 ring-primary-foreground/20 animate-pulse" />
                    )}
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-[15px] font-bold tracking-wide transition-colors duration-300 flex-1",
                    isActive(item.path) ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                  )}>
                    {t(item.labelKey)}
                  </span>

                  {/* Arrow */}
                  <ChevronRight className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive(item.path) ? "opacity-100 text-primary translate-x-0" : "opacity-0 text-muted-foreground -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
                  )} />

                  {/* Active indicator bar */}
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Premium Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            {/* Admin & Auth Section */}
            <div
              className={cn(
                "space-y-2.5",
                isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
              )}
              style={{ animationDelay: '450ms', animationFillMode: 'both' }}
            >
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group relative flex items-center gap-4 py-4 px-4 rounded-2xl overflow-hidden bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border border-primary/30 shadow-lg shadow-primary/15 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
                >
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                    <Shield className="relative h-5 w-5 text-primary-foreground z-10" strokeWidth={1.8} />
                    <span className="absolute inset-0 rounded-xl ring-2 ring-primary-foreground/20 animate-pulse" />
                  </div>
                  <span className="text-[15px] font-bold tracking-wide text-primary-foreground">Admin Panel</span>
                  <ChevronRight className="h-5 w-5 ml-auto text-primary opacity-100" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="group relative w-full flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 border bg-card/80 border-border/60 hover:bg-destructive/10 hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/10"
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                    "bg-gradient-to-br from-muted to-muted/70 group-hover:from-destructive group-hover:to-destructive/80 group-hover:shadow-lg group-hover:shadow-destructive/30 group-hover:scale-110"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                    <LogOut className="relative h-5 w-5 z-10 text-muted-foreground group-hover:text-destructive-foreground transition-colors duration-300" strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-bold tracking-wide text-foreground group-hover:text-destructive transition-colors duration-300">{t('nav.logout')}</span>
                  <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-destructive transition-all duration-300" />
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 border bg-card/80 border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                    "bg-gradient-to-br from-muted to-muted/70 group-hover:from-primary group-hover:to-accent group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                    <LogIn className="relative h-5 w-5 z-10 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-bold tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">{t('nav.login')}</span>
                  <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                </Link>
              )}
            </div>

            {/* Premium Contact Info */}
            <div
              className={cn(
                "mt-8 p-5 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 rounded-2xl border border-primary/15 shadow-inner",
                isMenuOpen ? 'animate-fade-in opacity-100' : 'opacity-0'
              )}
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">{t('nav.contactUs')}</p>
              <a
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="group flex items-center gap-3 text-lg font-bold text-foreground hover:text-primary transition-all duration-300"
              >
                <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/30 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                  <Phone className="relative h-5 w-5 text-primary-foreground z-10" strokeWidth={1.8} />
                </div>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
