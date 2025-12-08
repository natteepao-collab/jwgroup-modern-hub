import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { InteractiveSplitBusiness } from '@/components/InteractiveSplitBusiness';
import { useSiteContent } from '@/hooks/useSiteContent';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';
import wellness from '@/assets/business-wellness.jpg';

// Default images fallback
const defaultBusinessImages: Record<string, string> = {
  business_realestate_image: realEstate,
  business_hotel_image: hotel,
  business_pet_image: pet,
  business_wellness_image: wellness,
};

const Business = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { getImage } = useSiteContent();

  // Get business images from database or fallback to defaults
  const getBusinessImage = (sectionKey: string) => {
    const dbImage = getImage(sectionKey);
    return dbImage?.url || defaultBusinessImages[sectionKey] || realEstate;
  };

  const businesses = [
    {
      name: t('business.realEstate.name'),
      description: t('business.realEstate.description'),
      url: 'https://jwrealestate.com',
      image: getBusinessImage('business_realestate_image'),
      backgroundImage: getBusinessImage('business_realestate_bg'),
    },
    {
      name: t('business.hotel.name'),
      description: t('business.hotel.description'),
      url: 'https://12theresidence.com/th-th/',
      image: getBusinessImage('business_hotel_image'),
      backgroundImage: getBusinessImage('business_hotel_bg'),
    },
    {
      name: t('business.pet.name'),
      description: t('business.pet.description'),
      url: 'https://www.3dpethospital.com/',
      image: getBusinessImage('business_pet_image'),
      backgroundImage: getBusinessImage('business_pet_bg'),
    },
    {
      name: t('business.wellness.name'),
      description: t('business.wellness.description'),
      url: 'https://jwherbal-roots-and-remedies.lovable.app',
      image: getBusinessImage('business_wellness_image'),
      backgroundImage: getBusinessImage('business_wellness_bg'),
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('business.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('business.subtitle')}
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <InteractiveSplitBusiness businesses={businesses} />
        </div>
      </div>
    </div>
  );
};

export default Business;
