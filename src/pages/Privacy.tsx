import { useTranslation } from 'react-i18next';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/components/CookieConsent';
import { SEO } from '@/components/SEO';

const Privacy = () => {
  const { t } = useTranslation();
  const { openCookieSettings } = useCookieConsent();

  return (
    <div className="app-page-safe min-h-screen bg-background">
      <SEO
        title={t('legal.privacy.title')}
        description={t('legal.privacy.seoDesc')}
        canonicalUrl="/privacy"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('legal.privacy.title')}</h1>

        <div className="prose max-w-none space-y-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <section key={n}>
              <h2 className="text-2xl font-semibold mb-4">{t(`legal.privacy.s${n}Title`)}</h2>
              <p className="text-muted-foreground">{t(`legal.privacy.s${n}Body`)}</p>
            </section>
          ))}

          <section className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{t('legal.privacy.cookieTitle')}</h2>
                <p className="text-muted-foreground mb-4">{t('legal.privacy.cookieBody')}</p>
                <Button onClick={openCookieSettings} variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {t('legal.privacy.cookieButton')}
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.s6Title')}</h2>
            <p className="text-muted-foreground">
              {t('legal.privacy.s6Body')}
              <br />
              {t('legal.privacy.emailLabel')}: privacy@jwgroup.com
              <br />
              {t('legal.privacy.phoneLabel')}: +66 2 XXX XXXX
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
