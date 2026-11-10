import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import CorporateLayout from '@/components/CorporateLayout';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <CorporateLayout title={t('legal.terms.title')} document>
      <SEO
        title={t('legal.terms.title')}
        description={t('legal.terms.seoDesc')}
        canonicalUrl="/terms"
      />
      <div>

        <div className="space-y-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <section key={n}>
              <h2 className="text-2xl font-semibold mb-4">{t(`legal.terms.s${n}Title`)}</h2>
              <p className="text-muted-foreground">{t(`legal.terms.s${n}Body`)}</p>
            </section>
          ))}
        </div>
      </div>
    </CorporateLayout>
  );
};

export default Terms;
