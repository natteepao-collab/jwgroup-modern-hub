import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { InteractiveSplitBusiness } from '@/components/InteractiveSplitBusiness';
import { useSiteContent } from '@/hooks/useSiteContent';
import ProjectGallery from '@/components/ProjectGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Hotel, Heart, Leaf, Images } from 'lucide-react';
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

const businessTabs = [
  { id: 'realestate', label: 'อสังหาริมทรัพย์', icon: Building },
  { id: 'hotel', label: 'โรงแรม', icon: Hotel },
  { id: 'pet', label: 'สัตว์เลี้ยง', icon: Heart },
  { id: 'wellness', label: 'สุขภาพ', icon: Leaf },
];

const Business = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { getImage } = useSiteContent();
  const [activeTab, setActiveTab] = useState('realestate');

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
      brandColor: {
        collapsed: 'bg-orange-600/90 dark:bg-orange-700/90',
        expanded: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95), rgba(255, 255, 255, 0.98))',
        expandedDark: 'linear-gradient(to bottom, rgba(60, 42, 30, 0.95), rgba(41, 37, 36, 0.9), rgba(60, 42, 30, 0.95))',
      },
    },
    {
      name: t('business.hotel.name'),
      description: t('business.hotel.description'),
      url: 'https://12theresidence.com/th-th/',
      image: getBusinessImage('business_hotel_image'),
      backgroundImage: getBusinessImage('business_hotel_bg'),
      brandColor: {
        collapsed: 'bg-neutral-900/95 dark:bg-black/90',
        expanded: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95), rgba(255, 255, 255, 0.98))',
        expandedDark: 'linear-gradient(to bottom, rgba(23, 23, 23, 0.95), rgba(10, 10, 10, 0.9), rgba(23, 23, 23, 0.95))',
      },
    },
    {
      name: t('business.pet.name'),
      description: t('business.pet.description'),
      url: 'https://www.3dpethospital.com/',
      image: getBusinessImage('business_pet_image'),
      backgroundImage: getBusinessImage('business_pet_bg'),
      brandColor: {
        collapsed: 'bg-teal-500/90 dark:bg-teal-600/90',
        expanded: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95), rgba(255, 255, 255, 0.98))',
        expandedDark: 'linear-gradient(to bottom, rgba(17, 94, 89, 0.95), rgba(19, 78, 74, 0.9), rgba(17, 94, 89, 0.95))',
      },
    },
    {
      name: t('business.wellness.name'),
      description: t('business.wellness.description'),
      url: 'https://jwherbal-roots-and-remedies.lovable.app',
      image: getBusinessImage('business_wellness_image'),
      backgroundImage: getBusinessImage('business_wellness_bg'),
      brandColor: {
        collapsed: 'bg-green-400/90 dark:bg-green-500/90',
        expanded: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95), rgba(255, 255, 255, 0.98))',
        expandedDark: 'linear-gradient(to bottom, rgba(22, 101, 52, 0.95), rgba(20, 83, 45, 0.9), rgba(22, 101, 52, 0.95))',
      },
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

        {/* Project Gallery Section */}
        <div
          ref={galleryRef}
          className={`mt-20 transition-all duration-1000 ${
            galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Images className="w-4 h-4" />
              แกลเลอรี่โครงการ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              ผลงานโครงการของเรา
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              รวมผลงานโครงการที่ประสบความสำเร็จจากทุกสายธุรกิจของ JW Group
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              {businessTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {businessTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <ProjectGallery 
                  businessType={tab.id as 'realestate' | 'hotel' | 'pet' | 'wellness'} 
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Business;
