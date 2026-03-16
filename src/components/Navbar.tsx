import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, LogIn, LogOut, ChevronRight, ChevronDown, Home, Building2, Newspaper, Users, Phone, Info, Eye, Network, UserCircle, Award, Facebook, Instagram, Youtube, Moon, Sun } from 'lucide-react';

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
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const { getContent } = useSiteContent();
  const { links: socialLinks } = useSocialLinks();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Get contact phone from database
  const phoneContent = getContent('contact_phone');
  const phoneNumber = phoneContent.content || '02-234-5678';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Hide bottom bar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsBottomBarVisible(false);
      } else {
        setIsBottomBarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Quick Access Tab Items (Secondary Bar)
  const quickAccessItems = [
    { path: '/', labelKey: 'nav.home', icon: Home },
    { path: '/about/history', labelKey: 'nav.about', icon: Info },
    { path: '/business', labelKey: 'nav.business', icon: Building2 },
    { path: '/news', labelKey: 'nav.news', icon: Newspaper },
    { path: '/careers', labelKey: 'nav.careers', icon: Users },
    { path: '/contact', labelKey: 'nav.contact', icon: Phone },
  ];

  // Bottom Tab Items for mobile/tablet
  const bottomTabItems = [
    { path: '/', labelKey: 'nav.home', icon: Home },
    { path: '/business', labelKey: 'nav.business', icon: Building2 },
    { path: '/news', labelKey: 'nav.news', icon: Newspaper },
    { path: '/careers', labelKey: 'nav.careers', icon: Users },
    { path: '/contact', labelKey: 'nav.contact', icon: Phone },
  ];

  return (
    <>
      {/* Quick Access Secondary Bar - Minimal Icons Only - Mobile & Tablet Only */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 lg:hidden",
          isScrolled ? "h-0 opacity-0 pointer-events-none" : "h-10 opacity-100"
        )}
      >
        <div className="h-full bg-secondary/95 backdrop-blur-sm border-b border-primary/10">
          <div className="h-full max-w-md mx-auto px-4">
            <div className="flex items-center justify-between h-full">
              {quickAccessItems.map((item) => {
                const isItemActive = isActive(item.path) || (item.path === '/about/history' && isAboutActive);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group flex items-center justify-center p-2"
                    title={t(item.labelKey)}
                  >
                    <div className={cn(
                      "flex items-center justify-center transition-all duration-300",
                      isItemActive 
                        ? "text-primary scale-110" 
                        : "text-secondary-foreground/70 group-hover:text-primary group-hover:scale-110"
                    )}>
                      <item.icon className="h-5 w-5" strokeWidth={isItemActive ? 2.2 : 1.6} />
                    </div>
                    {/* Tooltip on hover */}
                    <div className={cn(
                      "absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap",
                      "bg-card text-card-foreground shadow-lg border border-border/50",
                      "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none",
                      "translate-y-1 group-hover:translate-y-0"
                    )}>
                      {t(item.labelKey)}
                      {/* Arrow */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-l border-t border-border/50 rotate-45" />
                    </div>
                    {/* Active indicator dot */}
                    {isItemActive && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Clean & Minimal */}
      <nav
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'top-0 bg-card/90 backdrop-blur-xl shadow-lg border-b border-border/50'
            : 'top-10 sm:top-11 lg:top-0 bg-background/30 backdrop-blur-lg border-b border-white/10'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Single Row Layout - All Breakpoints */}
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}>
            {/* Left - Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "flex items-center justify-center gap-2 h-10 w-10 lg:w-auto lg:h-11 lg:px-5 rounded-full transition-all duration-300",
                "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                "shadow-lg shadow-primary/25 border border-primary-foreground/10",
                "hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95",
                "btn-ripple btn-shimmer"
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
              <span className="hidden lg:inline text-sm font-extrabold tracking-widest uppercase">Menu</span>
            </button>

            {/* Center - Logo (Absolute Positioned for Perfect Center) */}
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
                  isScrolled ? "h-8 sm:h-9 lg:h-10" : "h-9 sm:h-10 lg:h-12"
                )}
              />
            </Link>

            {/* Right - Language Switcher Only */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Secondary Navigation Bar - Desktop Only */}
          <div className={cn(
            "hidden lg:flex items-center justify-between border-t border-foreground/10 transition-all duration-300",
            isScrolled ? "py-2" : "py-3"
          )}>
            {/* Left - Spacer */}
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

                    {aboutSubItems.map((item) => (
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

            {/* Right - Spacer to balance layout */}
            <div className="w-40" />
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar - Mobile & Tablet Only */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
        "bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]",
        isBottomBarVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="max-w-md mx-auto px-1">
          <div className="flex items-center justify-between py-1.5">
            {bottomTabItems.map((item) => {
              const isItemActive = isActive(item.path);
              // Short labels for mobile
              const getShortLabel = (key: string) => {
                const shortLabels: Record<string, string> = {
                  'nav.home': 'หน้าแรก',
                  'nav.business': 'ธุรกิจ',
                  'nav.news': 'ข่าวสาร',
                  'nav.careers': 'ร่วมงาน',
                  'nav.contact': 'ติดต่อ',
                };
                return shortLabels[key] || t(key);
              };
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
                    isItemActive
                      ? "bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25"
                      : "bg-transparent"
                  )}>
                    <item.icon className={cn(
                      "h-[18px] w-[18px] transition-colors duration-300",
                      isItemActive ? "text-primary-foreground" : "text-muted-foreground"
                    )} strokeWidth={isItemActive ? 2.2 : 1.8} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-semibold mt-0.5 transition-colors duration-300",
                    isItemActive ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {getShortLabel(item.labelKey)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Safe Area Padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      {/* Drawer Overlay Menu */}
      <div
        className={cn(
          'fixed inset-0 z-[100] transition-all duration-500',
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        )}
      >
        {/* Frosted Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/40 backdrop-blur-md transition-opacity duration-500',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-[88%] max-w-[420px] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "bg-card/98 backdrop-blur-2xl shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)]",
            "border-r border-border/30",
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* ── Header ── */}
          <div className="relative px-6 pt-6 pb-5">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary/40" />
            
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="group">
                <div className="p-2.5 bg-card rounded-2xl border border-border/50 shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
                  <img src={jwLogo} alt="JW Group" width="1754" height="1241" className="h-9 w-auto" />
                </div>
              </Link>

              <div className="flex items-center gap-2.5">
                <LanguageSwitcher />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/60 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105 active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-thin">
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="w-8 h-[2px] bg-gradient-to-r from-primary to-transparent rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('nav.home') === 'หน้าแรก' ? 'เมนูหลัก' : 'Navigation'}</span>
            </div>

            <nav className="space-y-1.5">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3.5 py-3.5 px-4 rounded-2xl transition-all duration-300",
                  isActive('/')
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-muted/60"
                )}
                style={{ animationDelay: '80ms', animationFillMode: 'both' }}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                  isActive('/')
                    ? "bg-primary-foreground/20"
                    : "bg-primary/10 group-hover:bg-primary/15"
                )}>
                  <Home className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive('/') ? "text-primary-foreground" : "text-primary"
                  )} strokeWidth={1.8} />
                </div>
                <span className={cn(
                  "text-[15px] font-semibold tracking-wide flex-1",
                  isActive('/') ? "text-primary-foreground" : "text-foreground"
                )}>
                  {t('nav.home')}
                </span>
                {isActive('/') && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground/60 animate-pulse" />
                )}
              </Link>

              {/* About Us - Expandable */}
              <div className="rounded-2xl overflow-hidden">
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className={cn(
                    "group relative w-full flex items-center gap-3.5 py-3.5 px-4 rounded-2xl transition-all duration-300",
                    isAboutActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "hover:bg-muted/60"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                    isAboutActive
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10 group-hover:bg-primary/15"
                  )}>
                    <Info className={cn(
                      "h-[18px] w-[18px] transition-colors",
                      isAboutActive ? "text-primary-foreground" : "text-primary"
                    )} strokeWidth={1.8} />
                  </div>
                  <span className={cn(
                    "text-[15px] font-semibold tracking-wide flex-1 text-left",
                    isAboutActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {t('nav.about')}
                  </span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isAboutActive ? "text-primary-foreground" : "text-muted-foreground",
                    aboutExpanded && "rotate-180"
                  )} />
                </button>

                {/* Submenu */}
                <div className={cn(
                  'overflow-hidden transition-all duration-400 ease-out',
                  aboutExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <div className="ml-6 mt-1.5 mb-2 space-y-1 pl-4 border-l-2 border-primary/20">
                    {aboutSubItems.map((item, subIndex) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300",
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                        style={{ animationDelay: `${subIndex * 40}ms`, animationFillMode: 'both' }}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 transition-colors",
                          isActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} strokeWidth={1.8} />
                        <span className={cn(
                          "text-[13px] font-medium flex-1",
                          isActive(item.path) ? "font-semibold text-primary" : ""
                        )}>
                          {t(item.labelKey)}
                        </span>
                        {isActive(item.path) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
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
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3.5 py-3.5 px-4 rounded-2xl transition-all duration-300",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "hover:bg-muted/60"
                  )}
                  style={{ animationDelay: `${120 + (index * 40)}ms`, animationFillMode: 'both' }}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                    isActive(item.path)
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10 group-hover:bg-primary/15"
                  )}>
                    <item.icon className={cn(
                      "h-[18px] w-[18px] transition-colors",
                      isActive(item.path) ? "text-primary-foreground" : "text-primary"
                    )} strokeWidth={1.8} />
                  </div>
                  <span className={cn(
                    "text-[15px] font-semibold tracking-wide flex-1",
                    isActive(item.path) ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {t(item.labelKey)}
                  </span>
                  {isActive(item.path) && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground/60 animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Divider ── */}
            <div className="my-6 flex items-center gap-3 px-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-border to-transparent" />
            </div>

            {/* ── Social Media ── */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3.5 px-1">
                <div className="w-6 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {t('nav.home') === 'หน้าแรก' ? 'ติดตามเรา' : 'Follow Us'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 px-2">
                {[
                  { href: socialLinks.facebook, icon: Facebook, label: 'Facebook', hoverBg: 'hover:bg-[#1877F2]', textColor: 'text-[#1877F2]' },
                  { href: socialLinks.instagram, icon: Instagram, label: 'Instagram', hoverBg: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]', textColor: 'text-[#E4405F]' },
                  { href: socialLinks.tiktok, icon: null, label: 'TikTok', hoverBg: 'hover:bg-foreground', textColor: 'text-foreground' },
                  { href: socialLinks.youtube, icon: Youtube, label: 'YouTube', hoverBg: 'hover:bg-[#FF0000]', textColor: 'text-[#FF0000]' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                      "bg-muted/50 border border-border/50",
                      social.hoverBg, "hover:border-transparent hover:text-white hover:scale-110 hover:shadow-lg"
                    )}
                    aria-label={social.label}
                  >
                    {social.icon ? (
                      <social.icon className={cn("h-[18px] w-[18px] transition-colors duration-300", social.textColor, "group-hover:text-white")} strokeWidth={1.8} />
                    ) : (
                      <TikTokIcon className={cn("h-[18px] w-[18px] transition-colors duration-300", social.textColor, "group-hover:text-background")} />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Theme Toggle ── */}
            <div className="mb-5 px-2">
              <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl border border-border/40">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-[18px] w-[18px] text-primary" />
                  ) : (
                    <Sun className="h-[18px] w-[18px] text-primary" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {theme === 'dark' ? (t('nav.home') === 'หน้าแรก' ? 'โหมดมืด' : 'Dark Mode') : (t('nav.home') === 'หน้าแรก' ? 'โหมดสว่าง' : 'Light Mode')}
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* ── Admin & Auth ── */}
            <div className="space-y-1.5 px-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
                    <Shield className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-semibold text-foreground">Admin Panel</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="group w-full flex items-center gap-3.5 py-3.5 px-4 rounded-2xl hover:bg-destructive/8 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/60 group-hover:bg-destructive/15 transition-colors duration-300">
                    <LogOut className="h-[18px] w-[18px] text-muted-foreground group-hover:text-destructive transition-colors" strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-semibold text-foreground group-hover:text-destructive transition-colors">{t('nav.logout')}</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3.5 py-3.5 px-4 rounded-2xl hover:bg-muted/60 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                    <LogIn className="h-[18px] w-[18px] text-primary" strokeWidth={1.8} />
                  </div>
                  <span className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </div>

          {/* ── Footer Contact ── */}
          <div className="px-6 py-5 border-t border-border/30 bg-muted/20">
            <a
              href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
              className="group flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Phone className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{t('nav.contactUs') || 'ติดต่อเรา'}</span>
                <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{phoneNumber}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Spacer for Bottom Tab Bar on Mobile/Tablet */}
      <div className="h-20 lg:hidden" />
    </>
  );
};
