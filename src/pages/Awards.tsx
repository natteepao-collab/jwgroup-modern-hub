import AwardsSection from '@/components/AwardsSection';
import { SEO } from '@/components/SEO';

const Awards = () => {
    return (
        <div className="pt-24 min-h-screen bg-background">
            <SEO
                title="รางวัลและความสำเร็จ"
                description="รางวัลและความสำเร็จของ JW Group เครื่องหมายการันตีคุณภาพและความมุ่งมั่นของเรา"
                canonicalUrl="/awards"
            />
            <AwardsSection />
        </div>
    );
};

export default Awards;
