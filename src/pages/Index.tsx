import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Users } from 'lucide-react';
import { InteractiveSplitBusiness } from '@/components/InteractiveSplitBusiness';
import { BentoNewsSection } from '@/components/BentoNewsSection';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import Hero3DBackground from '@/components/Hero3DBackground';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useNews } from '@/hooks/useNews';
import { ChairmanQuote } from '@/components/ChairmanQuote';
import { GoogleMapSection } from '@/components/GoogleMapSection';
import AnimatedStats from '@/components/AnimatedStats';
import CompanyTimeline from '@/components/CompanyTimeline';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterForm from '@/components/NewsletterForm';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';
import wellness from '@/assets/business-wellness.jpg';
import construction from '@/assets/business-construction.jpg';
import thanabulLogo from '@/assets/thanabul-logo.png';
import jwLogo from '@/assets/jw-group-logo-full.png';
import { SEO } from '@/components/SEO';

// Default images fallback
const defaultBusinessImages: Record<string, string> = {
  business_realestate_image: realEstate,
  business_hotel_image: hotel,
  business_pet_image: pet,
  business_wellness_image: wellness,
  business_construction_image: construction,
};

const Index = () => {
  const { t } = useTranslation();
  const { getContent, getImage, isLoading } = useSiteContent();
  const { news: dbNews, isLoading: newsLoading } = useNews();

  // Basic SEO setup for home page
  const seoTitle = t('hero.title') || "กลุ่มธุรกิจชั้นนำ | อสังหาริมทรัพย์ โรงแรม สัตวแพทย์ สุขภาพ";
  const seoDesc = t('hero.subtitle') || "JW Group - กลุ่มธุรกิจครบวงจรที่มุ่งมั่นสร้างสรรค์นวัตกรรมและคุณภาพชีวิตที่ดีกว่า";

  // Organization structured data for Google Knowledge Panel
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JW Group",
    "alternateName": "เจดับเบิ้ลยู กรุ๊ป",
    "url": "https://www.jwgroupthailand.com",
    "logo": "https://www.jwgroupthailand.com/og-image.png",
    "description": "JW Group - กลุ่มธุรกิจครบวงจรที่มุ่งมั่นสร้างสรรค์นวัตกรรมและคุณภาพชีวิตที่ดีกว่า ธุรกิจอสังหาริมทรัพย์ โรงแรมหรู โรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TH"
    },
    "sameAs": []
  };

  // Scroll reveal animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [businessRef, businessInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [newsRef, newsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [careersRef, careersInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Get business images from database or fallback to defaults
  const getBusinessImage = (sectionKey: string) => {
    const dbImage = getImage(sectionKey);
    return dbImage?.url || defaultBusinessImages[sectionKey] || realEstate;
  };

  // Get business content from database
  const realEstateContent = getContent('business_realestate');
  const hotelContent = getContent('business_hotel');
  const petContent = getContent('business_pet');
  const constructionContent = getContent('business_construction');
  const wellnessContent = getContent('business_wellness');

  // Get URLs from metadata or use defaults
  const getBusinessUrl = (content: ReturnType<typeof getContent>, defaultUrl: string) => {
    const metadata = content.metadata as Record<string, string> | null;
    return metadata?.url || defaultUrl;
  };

  const businesses = [
    {
      name: realEstateContent.title || t('business.realEstate.name'),
      description: realEstateContent.content || t('business.realEstate.description'),
      url: getBusinessUrl(realEstateContent, 'https://jwrealestate.com'),
      image: getBusinessImage('business_realestate_image'),
      backgroundImage: getBusinessImage('business_realestate_bg'),
    },
    {
      name: hotelContent.title || t('business.hotel.name'),
      description: hotelContent.content || t('business.hotel.description'),
      url: getBusinessUrl(hotelContent, 'https://12theresidence.com/th-th/'),
      image: getBusinessImage('business_hotel_image'),
      backgroundImage: getBusinessImage('business_hotel_bg'),
    },
    {
      name: petContent.title || t('business.pet.name'),
      description: petContent.content || t('business.pet.description'),
      url: getBusinessUrl(petContent, 'https://www.3dpethospital.com/'),
      image: getBusinessImage('business_pet_image'),
      backgroundImage: getBusinessImage('business_pet_bg'),
      logoStyle: { scale: 1.3 },
    },
    {
      name: wellnessContent.title || t('business.wellness.name'),
      description: wellnessContent.content || t('business.wellness.description'),
      url: getBusinessUrl(wellnessContent, 'https://jwherbal-roots-and-remedies.lovable.app'),
      image: getBusinessImage('business_wellness_image'),
      backgroundImage: getBusinessImage('business_wellness_bg'),
      logoStyle: { scale: 1.4 },
    },
    {
      name: constructionContent.title || 'ธนบูลย์ พร็อพเพอร์ตี้',
      description: constructionContent.content || 'บริษัท ธนบูลย์ พร็อพเพอร์ตี้ จำกัด ผู้เชี่ยวชาญด้านการรับเหมาก่อสร้าง และพัฒนาอสังหาริมทรัพย์คุณภาพสูง ด้วยประสบการณ์และความชำนาญในการสร้างสรรค์โครงการที่ได้มาตรฐาน',
      url: getBusinessUrl(constructionContent, '#'),
      image: thanabulLogo,
      backgroundImage: getBusinessImage('business_construction_image'),
      logoStyle: { scale: 1.5 },
    },
  ];

  // Use database news or empty array while loading
  const displayNews = dbNews.length > 0 ? dbNews : [];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonicalUrl="/"
        structuredData={organizationSchema}
      />
      <AnnouncementModal autoShow delay={1500} />

      {/* Hero Section - Cinematic Video Only - Responsive height */}
      <section
        ref={heroRef}
        className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden"
      >
        <Hero3DBackground />
      </section>

      {/* About Section with Stats */}
      <section
        ref={aboutRef}
        className={`py-20 bg-background transition-all duration-1000 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              {getContent('about_section').title || t('aboutSection.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-2 sm:px-4 md:px-0 text-balance">
              {getContent('about_section').content || t('aboutSection.description')}
            </p>
          </div>
        </div>

        {/* Animated Stats integrated into About */}
        <AnimatedStats />
      </section>

      {/* Chairman Quote Section */}
      {(() => {
        const quoteContent = getContent('chairman_quote');
        const metadata = quoteContent.metadata as Record<string, string> | null;
        return (
          <ChairmanQuote
            quote={quoteContent.content || 'เราเชื่อมั่นว่าคุณภาพและความใส่ใจในทุกรายละเอียด คือหัวใจสำคัญที่จะสร้างความไว้วางใจจากลูกค้า และนำพาองค์กรไปสู่ความสำเร็จอย่างยั่งยืน'}
            name={quoteContent.title || 'คุณสมชาย วิสุทธิ์ธรรม'}
            title={metadata?.position_th || metadata?.position_en || 'ประธานกรรมการบริหาร JW GROUP'}
          />
        );
      })()}

      {/* Company Timeline Section */}
      <CompanyTimeline />

      {/* Business Section */}
      <section
        ref={businessRef}
        className={`py-20 bg-accent/20 transition-all duration-1000 ${businessInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-2">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {t('business.sectionLabel')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {getContent('business_section').title || t('business.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {getContent('business_section').content || t('business.subtitle')}
            </p>
          </div>

          <InteractiveSplitBusiness businesses={businesses} />
        </div>
      </section>

      {/* News Section */}
      <section
        ref={newsRef}
        className={`py-20 bg-background transition-all duration-1000 ${newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-2">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {t('news.sectionLabel')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {getContent('news_section').title || t('news.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {getContent('news_section').content || t('news.subtitle')}
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/news" className="flex items-center gap-2">
                {t('news.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <BentoNewsSection
            news={displayNews}
            showFilters={false}
            maxItems={6}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />



      {/* Careers Teaser Section */}
      <section
        ref={careersRef}
        className={`py-20 relative overflow-hidden transition-all duration-1000 ${careersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        {/* Orange Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float-particle"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}

        {/* Sparkle Effects */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-white/40">
              <path
                fill="currentColor"
                d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z"
              />
            </svg>
          </div>
        ))}

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            {getContent('careers_section').title || t('careers.title')}
          </h2>
          <p className="text-xl mb-8 text-white/90 drop-shadow-md">
            {getContent('careers_section').content || t('careers.description')}
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg shadow-xl hover:shadow-2xl"
          >
            <Link to="/careers">{t('careers.viewPositions')}</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <NewsletterForm />
        </div>
      </section>

      {/* Google Map Section */}
      <GoogleMapSection />
    </div>
  );
};

export default Index;
