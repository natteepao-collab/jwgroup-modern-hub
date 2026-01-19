import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { InteractiveSplitBusiness } from '@/components/InteractiveSplitBusiness';
import { useSiteContent } from '@/hooks/useSiteContent';
import ProjectGallery from '@/components/ProjectGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Building, Hotel, Heart, Leaf, Images, HardHat } from 'lucide-react';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';
import wellness from '@/assets/business-wellness.jpg';
import construction from '@/assets/business-construction.jpg';
import thanabulLogo from '@/assets/thanabul-logo.png';

// Default images fallback
const defaultBusinessImages: Record<string, string> = {
  business_realestate_image: realEstate,
  business_hotel_image: hotel,
  business_pet_image: pet,
  business_wellness_image: wellness,
  business_construction_image: construction,
};

const businessTabs = [
  {
    id: 'realestate',
    label: 'JW Real Estates',
    icon: Building,
    activeColor: 'data-[state=active]:bg-[#D97706] data-[state=active]:text-white',
    hoverColor: 'hover:bg-[#D97706]/10 hover:text-[#D97706]'
  },
  {
    id: 'hotel',
    label: '12 The Residence',
    icon: Hotel,
    activeColor: 'data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white',
    hoverColor: 'hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A]'
  },
  {
    id: 'pet',
    label: '3DPet Hospital',
    icon: Heart,
    activeColor: 'data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white',
    hoverColor: 'hover:bg-[#14B8A6]/10 hover:text-[#14B8A6]'
  },
  {
    id: 'wellness',
    label: 'JW Herbal',
    icon: Leaf,
    activeColor: 'data-[state=active]:bg-[#22C55E] data-[state=active]:text-white',
    hoverColor: 'hover:bg-[#22C55E]/10 hover:text-[#22C55E]'
  },
  {
    id: 'construction',
    label: 'ธนบูลย์',
    icon: HardHat,
    activeColor: 'data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white',
    hoverColor: 'hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'
  },
];

const Business = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { getImage, getContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState('realestate');
  const isMobile = useIsMobile();
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  // Handle tab change with scroll on mobile
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isMobile && galleryContainerRef.current) {
      setTimeout(() => {
        galleryContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Get business images from database or fallback to defaults
  const getBusinessImage = (sectionKey: string) => {
    const dbImage = getImage(sectionKey);
    return dbImage?.url || defaultBusinessImages[sectionKey] || realEstate;
  };

  // Get construction content from database
  const constructionContent = getContent('business_construction');

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
      logoStyle: { scale: 1.3 },
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
      logoStyle: { scale: 1.4 },
    },
    {
      name: constructionContent.title || 'ธนบูลย์ พร็อพเพอร์ตี้',
      description: constructionContent.content || 'บริษัท ธนบูลย์ พร็อพเพอร์ตี้ จำกัด ผู้เชี่ยวชาญด้านการรับเหมาก่อสร้าง และพัฒนาอสังหาริมทรัพย์คุณภาพสูง ด้วยประสบการณ์และความชำนาญในการสร้างสรรค์โครงการที่ได้มาตรฐาน',
      url: '#',
      image: thanabulLogo,
      backgroundImage: getBusinessImage('business_construction_image'),
      brandColor: {
        collapsed: 'bg-blue-500/90 dark:bg-blue-600/90',
        expanded: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95), rgba(255, 255, 255, 0.98))',
        expandedDark: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.95), rgba(29, 78, 216, 0.9), rgba(30, 58, 138, 0.95))',
      },
      logoStyle: { scale: 1.5 },
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('business.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('business.subtitle')}
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          <InteractiveSplitBusiness businesses={businesses} />
        </div>

        {/* Project Gallery Section */}
        <div
          ref={galleryRef}
          className={`mt-24 transition-all duration-1000 ${galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 text-primary text-sm font-semibold mb-6 border border-primary/20 shadow-sm">
              <Images className="w-4 h-4" />
              <span>แกลเลอรี่โครงการ</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              ผลงานโครงการของเรา
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              รวมผลงานโครงการที่ประสบความสำเร็จจากทุกสายธุรกิจของ JW Group
            </p>
          </div>

          {/* Tabs Container */}
          <div ref={galleryContainerRef}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              {/* Enhanced Tab List */}
              <TabsList className="flex w-full max-w-4xl mx-auto mb-12 h-auto p-2 bg-card/80 backdrop-blur-lg border border-border/40 rounded-2xl shadow-xl">
                {businessTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`flex-1 gap-2.5 py-4 px-4 rounded-xl font-bold text-base transition-all duration-300
                      ${tab.activeColor} ${tab.hoverColor}
                      data-[state=active]:shadow-lg data-[state=active]:scale-105
                      text-muted-foreground`}
                  >
                    <tab.icon className="w-5 h-5 mb-0.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {businessTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0 animate-fade-in">
                  <ProjectGallery
                    businessType={tab.id as 'realestate' | 'hotel' | 'pet' | 'wellness' | 'construction'}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
