import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, LogIn, LogOut, ChevronRight, Home, Building2, Newspaper, Users, Phone, Info, Eye, Network, UserCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import jwLogo from '@/assets/jw-group-logo-full.png';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

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
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/business', label: t('nav.business'), icon: Building2 },
    { path: '/news', label: t('nav.news'), icon: Newspaper },
    { path: '/careers', label: t('nav.careers'), icon: Users },
    { path: '/contact', label: t('nav.contact'), icon: Phone },
  ];

  const aboutSubItems = [
    { path: '/about/history', label: t('about.history'), icon: Info },
    { path: '/about/vision', label: t('about.vision'), icon: Eye },
    { path: '/about/structure', label: t('about.structure'), icon: Network },
    { path: '/about/team', label: t('about.team'), icon: UserCircle },
    { path: '/about/awards', label: t('about.awards'), icon: Award },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-card/95 backdrop-blur-md shadow-md py-3'
            : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Menu className="h-6 w-6" />
              <span className="text-sm font-medium hidden sm:inline">เมนู</span>
            </button>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <div
        className={cn(
          'fixed inset-0 z-[100] transition-all duration-500',
          isMenuOpen ? 'visible' : 'invisible'
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            'absolute inset-0 bg-background/98 backdrop-blur-lg transition-opacity duration-500',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={cn(
            'relative h-full w-full overflow-y-auto transition-all duration-500',
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <X className="h-6 w-6" />
                  <span className="text-sm font-medium">ปิดเมนู</span>
                </button>

                <img src={jwLogo} alt="JW Group" className="h-8" />

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Main Navigation */}
              <nav className="space-y-1">
                {/* Home */}
                <Link
                  to="/"
                  className={cn(
                    'flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300 group',
                    'hover:bg-accent hover:pl-6',
                    isActive('/') && 'bg-primary/10 text-primary'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Home className="h-5 w-5" />
                    <span className="text-lg font-medium">{t('nav.home')}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* About Us - Expandable */}
                <div>
                  <button
                    onClick={() => setAboutExpanded(!aboutExpanded)}
                    className={cn(
                      'w-full flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300',
                      'hover:bg-accent hover:pl-6',
                      isAboutActive && 'bg-primary/10 text-primary'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Info className="h-5 w-5" />
                      <span className="text-lg font-medium">{t('nav.about')}</span>
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
                      'overflow-hidden transition-all duration-300',
                      aboutExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="pl-8 pr-4 py-2 space-y-1">
                      {aboutSubItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300',
                            'hover:bg-accent hover:pl-6 text-muted-foreground hover:text-foreground',
                            isActive(item.path) && 'text-primary font-medium'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
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
                      'flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300 group',
                      'hover:bg-accent hover:pl-6',
                      isActive(item.path) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="h-5 w-5" />
                      <span className="text-lg font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-8 border-t border-border" />

              {/* Admin & Auth Section */}
              <div className="space-y-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-4 py-3 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 py-3 px-4 rounded-xl border border-border hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">ออกจากระบบ</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-4 py-3 px-4 rounded-xl border border-border hover:bg-accent transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">เข้าสู่ระบบ</span>
                  </Link>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-sm mb-2">ติดต่อเรา</p>
                <a 
                  href="tel:+6622345678" 
                  className="text-2xl font-display font-bold text-primary hover:underline"
                >
                  02-234-5678
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
