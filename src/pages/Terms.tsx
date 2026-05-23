import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="app-page-safe min-h-screen bg-background">
      <SEO
        title={t('legal.terms.title')}
        description={t('legal.terms.seoDesc')}
        canonicalUrl="/terms"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('legal.terms.title')}</h1>

        <div className="prose max-w-none space-y-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <section key={n}>
              <h2 className="text-2xl font-semibold mb-4">{t(`legal.terms.s${n}Title`)}</h2>
              <p className="text-muted-foreground">{t(`legal.terms.s${n}Body`)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
