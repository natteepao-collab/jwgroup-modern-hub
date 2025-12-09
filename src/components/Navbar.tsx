import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, LogIn, LogOut, ChevronRight, Home, Building2, Newspaper, Users, Phone, Info, Eye, Network, UserCircle, Award } from 'lucide-react';
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
    { path: '/', label: 'หน้าแรก', icon: Home },
    { path: '/business', label: 'ธุรกิจของเรา', icon: Building2 },
    { path: '/news', label: 'ข่าวสาร', icon: Newspaper },
    { path: '/careers', label: 'ร่วมงานกับเรา', icon: Users },
    { path: '/contact', label: 'ติดต่อเรา', icon: Phone },
  ];

  const aboutSubItems = [
    { path: '/about/history', label: 'ประวัติ JW Group', icon: Info },
    { path: '/about/vision', label: 'วิสัยทัศน์และพันธกิจ', icon: Eye },
    { path: '/about/structure', label: 'โครงสร้างองค์กร', icon: Network },
    { path: '/about/team', label: 'ทีมผู้บริหาร', icon: UserCircle },
    { path: '/about/awards', label: 'รางวัลและความสำเร็จ', icon: Award },
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
            ? 'bg-card/95 backdrop-blur-md shadow-md py-3'
            : 'bg-background/30 backdrop-blur-sm py-4'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300",
                "hover:bg-foreground/10",
                isScrolled 
                  ? "text-foreground" 
                  : "text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              )}
            >
              <Menu className="h-6 w-6" strokeWidth={2.5} />
              <span className="text-sm font-bold tracking-wide hidden sm:inline uppercase">เมนู</span>
            </button>

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
            'absolute inset-0 bg-secondary/98 backdrop-blur-xl transition-opacity duration-500',
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
          <div className="sticky top-0 z-10 bg-secondary/80 backdrop-blur-md border-b border-border/20">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-secondary-foreground hover:text-primary transition-colors"
                >
                  <X className="h-6 w-6" strokeWidth={2.5} />
                  <span className="text-sm font-semibold tracking-wide">ปิดเมนู</span>
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
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-xl mx-auto">
              {/* Main Navigation */}
              <nav className="space-y-2">
                {/* Home */}
                <Link
                  to="/"
                  className={cn(
                    'flex items-center justify-between py-5 px-6 rounded-2xl transition-all duration-300 group',
                    'hover:bg-primary/10 hover:pl-8',
                    isActive('/') ? 'bg-primary/15 text-primary' : 'text-secondary-foreground'
                  )}
                >
                  <div className="flex items-center gap-5">
                    <Home className="h-6 w-6" strokeWidth={2} />
                    <span className="text-xl font-semibold tracking-wide">หน้าแรก</span>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Link>

                {/* About Us - Expandable */}
                <div>
                  <button
                    onClick={() => setAboutExpanded(!aboutExpanded)}
                    className={cn(
                      'w-full flex items-center justify-between py-5 px-6 rounded-2xl transition-all duration-300',
                      'hover:bg-primary/10 hover:pl-8',
                      isAboutActive ? 'bg-primary/15 text-primary' : 'text-secondary-foreground'
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <Info className="h-6 w-6" strokeWidth={2} />
                      <span className="text-xl font-semibold tracking-wide">เกี่ยวกับเรา</span>
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
                      'overflow-hidden transition-all duration-400 ease-out',
                      aboutExpanded ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="ml-8 pl-6 border-l-2 border-primary/30 space-y-1">
                      {aboutSubItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            'flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300',
                            'hover:bg-primary/10 hover:pl-6',
                            isActive(item.path) 
                              ? 'text-primary font-semibold' 
                              : 'text-secondary-foreground/80 hover:text-secondary-foreground'
                          )}
                        >
                          <item.icon className="h-5 w-5" strokeWidth={2} />
                          <span className="font-medium tracking-wide">{item.label}</span>
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
                      'flex items-center justify-between py-5 px-6 rounded-2xl transition-all duration-300 group',
                      'hover:bg-primary/10 hover:pl-8',
                      isActive(item.path) ? 'bg-primary/15 text-primary' : 'text-secondary-foreground'
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <item.icon className="h-6 w-6" strokeWidth={2} />
                      <span className="text-xl font-semibold tracking-wide">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-10 border-t border-border/30" />

              {/* Admin & Auth Section */}
              <div className="space-y-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-5 py-4 px-6 rounded-2xl bg-primary/15 text-primary hover:bg-primary/25 transition-all duration-300"
                  >
                    <Shield className="h-6 w-6" strokeWidth={2} />
                    <span className="text-lg font-semibold tracking-wide">Admin Panel</span>
                  </Link>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-5 py-4 px-6 rounded-2xl border-2 border-border/50 text-secondary-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <LogOut className="h-6 w-6" strokeWidth={2} />
                    <span className="text-lg font-semibold tracking-wide">ออกจากระบบ</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-5 py-4 px-6 rounded-2xl border-2 border-border/50 text-secondary-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <LogIn className="h-6 w-6" strokeWidth={2} />
                    <span className="text-lg font-semibold tracking-wide">เข้าสู่ระบบ</span>
                  </Link>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-16 text-center">
                <p className="text-secondary-foreground/60 text-sm font-medium tracking-wider uppercase mb-3">ติดต่อเรา</p>
                <a 
                  href="tel:+6622345678" 
                  className="text-3xl font-display font-bold text-primary hover:text-primary/80 transition-colors tracking-wider"
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
