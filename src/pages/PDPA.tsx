import { useTranslation } from 'react-i18next';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/components/CookieConsent';
import { SEO } from '@/components/SEO';

const PDPA = () => {
  const { t } = useTranslation();
  const { openCookieSettings } = useCookieConsent();

  const s1Items = t('legal.pdpa.s1Items', { returnObjects: true }) as string[];
  const s2Items = t('legal.pdpa.s2Items', { returnObjects: true }) as string[];
  const s3Items = t('legal.pdpa.s3Items', { returnObjects: true }) as string[];

  return (
    <div className="app-page-safe min-h-screen bg-background">
      <SEO
        title={t('legal.pdpa.title')}
        description={t('legal.pdpa.seoDesc')}
        canonicalUrl="/pdpa"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('legal.pdpa.title')}</h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.pdpa.introTitle')}</h2>
            <p className="text-muted-foreground">{t('legal.pdpa.introBody')}</p>
          </section>

          {[
            { title: 's1Title', intro: 's1Intro', items: s1Items },
            { title: 's2Title', intro: 's2Intro', items: s2Items },
            { title: 's3Title', intro: 's3Intro', items: s3Items },
          ].map((sec) => (
            <section key={sec.title}>
              <h2 className="text-2xl font-semibold mb-4">{t(`legal.pdpa.${sec.title}`)}</h2>
              <p className="text-muted-foreground mb-2">{t(`legal.pdpa.${sec.intro}`)}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {Array.isArray(sec.items) && sec.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.pdpa.s4Title')}</h2>
            <p className="text-muted-foreground">{t('legal.pdpa.s4Body')}</p>
          </section>

          <section className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{t('legal.pdpa.cookieTitle')}</h2>
                <p className="text-muted-foreground mb-4">{t('legal.pdpa.cookieBody')}</p>
                <Button onClick={openCookieSettings} variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {t('legal.pdpa.cookieButton')}
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.pdpa.s5Title')}</h2>
            <p className="text-muted-foreground">
              {t('legal.pdpa.s5Intro')}
              <br />
              <strong>{t('legal.pdpa.dpoLabel')}</strong>
              <br />
              {t('legal.pdpa.emailLabel')}: dpo@jwgroup.com
              <br />
              {t('legal.pdpa.phoneLabel')}: +66 2 XXX XXXX
              <br />
              {t('legal.pdpa.addressLabel')}: {t('legal.pdpa.addressValue')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.pdpa.s6Title')}</h2>
            <p className="text-muted-foreground">{t('legal.pdpa.s6Body')}</p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            <strong>{t('legal.pdpa.lastUpdatedLabel')}:</strong> {t('legal.pdpa.lastUpdatedDate')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDPA;
