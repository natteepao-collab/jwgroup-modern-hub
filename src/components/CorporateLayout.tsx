import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info, Eye, Network, UserCircle, Award, Shield, Lock, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const corporateLinks = [
  { path: '/about/history', labelKey: 'about.history', icon: Info },
  { path: '/about/vision', labelKey: 'about.vision', icon: Eye },
  { path: '/about/structure', labelKey: 'about.structure', icon: Network },
  { path: '/about/team', labelKey: 'about.team', icon: UserCircle },
  { path: '/about/awards', labelKey: 'about.awards', icon: Award },
  { path: '/pdpa', labelKey: 'footer.pdpa', icon: Shield },
  { path: '/privacy', labelKey: 'footer.privacy', icon: Lock },
  { path: '/terms', labelKey: 'footer.terms', icon: FileText },
];

export default function CorporateLayout({ children, title, description, document = false }: {
  children: ReactNode; title?: string; description?: string; document?: boolean;
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <div className={cn('corporate-page app-page-safe min-h-screen bg-background', pathname === '/about/structure' && 'about-structure-page')}>
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="min-w-0">
            <div className="lg:sticky app-sticky-below-navbar">
              <h2 className="mb-5 border-l-2 border-primary pl-4 text-xl font-bold text-foreground">{t('nav.about')}</h2>
              <nav aria-label={t('nav.about')} className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {corporateLinks.map(item => {
                  const active = pathname === item.path || (item.path === '/about/awards' && pathname === '/awards');
                  return <Button key={item.path} asChild variant={active ? 'secondary' : 'ghost'} className="corporate-nav-link h-auto min-h-12 justify-start gap-3 whitespace-normal px-3 py-3 text-left">
                    <Link to={item.path} aria-current={active ? 'page' : undefined}>
                      <item.icon className={cn('shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                      <span className="min-w-0 flex-1 text-sm font-medium leading-relaxed">{t(item.labelKey)}</span>
                      <ChevronRight className="hidden lg:block" />
                    </Link>
                  </Button>;
                })}
              </nav>
            </div>
          </aside>
          <div className="min-w-0">
            {title && <header className="corporate-title-band bg-secondary text-secondary-foreground border-b-2 border-primary px-5 py-7 sm:px-8 sm:py-10">
              <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{title}</h1>
              {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary-foreground/85 sm:text-base">{description}</p>}
            </header>}
            <div className={cn('corporate-content', title && 'pt-8 sm:pt-10', document && 'corporate-document')}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}