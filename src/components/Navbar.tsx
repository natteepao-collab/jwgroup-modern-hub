import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Shield, LogIn, LogOut, ChevronRight, Home, Building2, Newspaper, Users, Phone, X, Info, Eye, Network, UserCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={jwLogo} 
              alt="JW Group" 
              className={cn(
                "transition-all duration-300",
                isScrolled ? "h-10" : "h-12"
              )}
            />
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Admin Panel Button - Only visible to admins */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Shield className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Login/Logout Button */}
            {user ? (
              <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Link to="/auth" className="hidden sm:flex">
                <Button variant="ghost" size="icon">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <ThemeToggle />
            <LanguageSwitcher />

            {/* Hamburger Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[380px] p-0 bg-card border-l border-border"
              >
                <SheetHeader className="p-6 pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-3">
                    <img src={jwLogo} alt="JW Group" className="h-10" />
                  </SheetTitle>
                </SheetHeader>

                {/* Navigation Links */}
                <div className="flex flex-col py-4">
                  {/* Home */}
                  <Link
                    to="/"
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive('/') && "bg-primary/10 text-primary border-r-4 border-primary"
                    )}
                  >
                    <Home className="h-5 w-5" />
                    <span className="font-medium">{t('nav.home')}</span>
                  </Link>

                  {/* About Us - Collapsible */}
                  <Collapsible open={aboutOpen || isAboutActive} onOpenChange={setAboutOpen}>
                    <CollapsibleTrigger className={cn(
                      "flex items-center justify-between w-full px-6 py-4 transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      isAboutActive && "bg-primary/10 text-primary border-r-4 border-primary"
                    )}>
                      <div className="flex items-center gap-4">
                        <Info className="h-5 w-5" />
                        <span className="font-medium">{t('nav.about')}</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        (aboutOpen || isAboutActive) && "rotate-90"
                      )} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-muted/30">
                      {aboutSubItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "flex items-center gap-4 pl-14 pr-6 py-3 transition-all duration-200",
                            "hover:bg-accent hover:text-accent-foreground text-sm",
                            isActive(item.path) && "text-primary font-medium"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Other Menu Items */}
                  {menuItems.slice(1).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive(item.path) && "bg-primary/10 text-primary border-r-4 border-primary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card">
                  {/* Admin - Mobile Only */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                  
                  {/* Login/Logout */}
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3" 
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>ออกจากระบบ</span>
                    </Button>
                  ) : (
                    <Link to="/auth" className="block">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <LogIn className="h-5 w-5" />
                        <span>เข้าสู่ระบบ</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
