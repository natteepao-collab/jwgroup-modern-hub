import { useTranslation } from 'react-i18next';
import AwardsSection from '@/components/AwardsSection';
import { SEO } from '@/components/SEO';
import { buildBreadcrumb } from '@/lib/seoSchemas';
import CorporateLayout from '@/components/CorporateLayout';

const Awards = () => {
    const { t } = useTranslation();
    return (
        <CorporateLayout title={t('awards.title')}>
            <SEO
                title={t('awards.title')}
                description={t('awards.seoDesc')}
                canonicalUrl="/awards"
                structuredData={buildBreadcrumb([{ name: t('awards.title'), path: '/awards' }])}
            />
            <AwardsSection />
        </CorporateLayout>
    );
};

export default Awards;
