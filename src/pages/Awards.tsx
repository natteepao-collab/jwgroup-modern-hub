import { useTranslation } from 'react-i18next';
import AwardsSection from '@/components/AwardsSection';
import { SEO } from '@/components/SEO';
import { buildBreadcrumb } from '@/lib/seoSchemas';

const Awards = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-24 min-h-screen bg-background">
            <SEO
                title={t('awards.title')}
                description={t('awards.seoDesc')}
                canonicalUrl="/awards"
                structuredData={buildBreadcrumb([{ name: t('awards.title'), path: '/awards' }])}
            />
            <AwardsSection />
        </div>
    );
};

export default Awards;
