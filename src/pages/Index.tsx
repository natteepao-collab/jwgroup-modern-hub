import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { InteractiveSplitBusiness } from '@/components/InteractiveSplitBusiness';
import { BentoNewsSection } from '@/components/BentoNewsSection';
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
import { SEO } from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';

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
  const seoTitle = t('legal.home.seoTitle');
  const seoDesc = t('legal.home.seoDesc');

  // Organization + WebSite structured data for Google Knowledge Panel
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.jwgroupthailand.com/#organization",
        "name": "JW Group",
        "alternateName": "เจดับเบิ้ลยู กรุ๊ป",
        "url": "https://www.jwgroupthailand.com",
        "logo": "https://www.jwgroupthailand.com/og-image.png",
        "image": "https://www.jwgroupthailand.com/og-image.png",
        "description": "JW Group - กลุ่มธุรกิจครบวงจร อสังหาริมทรัพย์ โรงแรม โรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ",
        "foundingDate": "1990",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "เลขที่ 9 ซอยสรณคมน์ 12 ถนนสรณคมน์",
          "addressLocality": "แขวงสีกัน เขตดอนเมือง",
          "addressRegion": "กรุงเทพมหานคร",
          "postalCode": "10210",
          "addressCountry": "TH"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+66-2-566-1111",
          "contactType": "customer service",
          "email": "jwgroupmkt@gmail.com",
          "areaServed": "TH",
          "availableLanguage": ["Thai", "English"]
        },
        "sameAs": [
          "https://www.facebook.com/JwRealestateCoLtd/",
          "https://www.youtube.com/@JWgroupthai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.jwgroupthailand.com/#website",
        "url": "https://www.jwgroupthailand.com",
        "name": "JW Group",
        "inLanguage": "th-TH",
        "publisher": { "@id": "https://www.jwgroupthailand.com/#organization" }
      }
    ]
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
      url: getBusinessUrl(realEstateContent, 'https://www.jwrealestate.co.th'),
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
      url: getBusinessUrl(wellnessContent, 'https://www.jwherbal.com'),
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
    <div className="home-page min-h-screen">
      <SEO
        title="JW Group กลุ่มธุรกิจอสังหาริมทรัพย์ โรงแรม สุขภาพ และบริการครบวงจร"
        description="JW Group กลุ่มธุรกิจชั้นนำในประเทศไทย ครอบคลุมอสังหาริมทรัพย์ โรงแรม 12 The Residence โรงพยาบาลสัตว์ 3DPet ผลิตภัณฑ์สุขภาพ JW Herbal และรับเหมาก่อสร้าง ธนบูลย์ พร็อพเพอร์ตี้"
        canonicalUrl="/"
        structuredData={organizationSchema}
      />

      {/* Welcome modal disabled to reduce intrusion on first impression. 
          Trigger manually via state if ever needed. */}
      {/* <AnnouncementModal autoShow delay={1500} /> */}

      {/* Hero Section - Cinematic Video + Headline overlay */}
      <section
        ref={heroRef}
        aria-label="JW Group hero"
        className="home-hero relative h-[60svh] min-h-[460px] sm:h-[72svh] sm:min-h-[520px] lg:h-[82svh] lg:min-h-[600px] overflow-hidden"
      >
        <Hero3DBackground />

        <div className="home-hero-content container absolute inset-x-0 bottom-9 sm:bottom-12 lg:bottom-16 z-10 px-6 lg:px-8">
          <h1 className="home-hero-title font-bold">JW Group</h1>
          <p className="home-hero-scope mt-4 mb-7 max-w-2xl text-base sm:text-lg leading-relaxed">{t('refinement.scope')}</p>
          <div
            className="flex w-full max-w-sm sm:max-w-none sm:w-auto flex-col sm:flex-row gap-3 sm:justify-start items-center"
          >
            <Button
              asChild
              size="lg"
              className="home-hero-primary group w-full sm:w-auto text-base px-7 sm:px-9 h-12 sm:h-14 font-bold"
            >
              <Link to="/business" onClick={() => trackEvent('cta_click', { label: 'hero_explore_business' })}>
                {t('hero.ctaBusiness')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="home-hero-contact w-full sm:w-auto text-base px-7 sm:px-9 h-12 sm:h-14 font-bold"
            >
              <Link to="/contact" onClick={() => trackEvent('cta_click', { label: 'hero_contact' })}>
                {t('nav.contact')}
              </Link>
            </Button>
          </div>
        </div>
      </section>



      {/* About Section with Stats */}
      <section
        ref={aboutRef}
        className={`home-section home-about bg-background ${aboutInView ? 'is-revealed' : ''}
          }`}
      >
        <div className="container mx-auto px-6 lg:px-8 sm:px-6 lg:px-8">
          <div className="home-section-heading text-center mb-10 sm:mb-14 max-w-4xl mx-auto">
            <h2 className="home-heading font-bold text-foreground mb-5 leading-snug">
              {getContent('about_section').title || t('aboutSection.title')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-loose max-w-[70ch] mx-auto text-pretty">
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
        if (!quoteContent.title || !quoteContent.content) return null;
        return (
          <ChairmanQuote
            quote={quoteContent.content}
            name={quoteContent.title}
            title={metadata?.position_th || metadata?.position_en || ''}
          />
        );
      })()}

      {/* Company Timeline Section */}
      <CompanyTimeline />

      {/* Business Section */}
      <section
        ref={businessRef}
        className={`home-section home-business bg-muted/20 border-y border-border/60 ${businessInView ? 'is-revealed' : ''}
          }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="home-section-heading text-center mb-10 sm:mb-14">
            <h2 className="home-heading font-bold text-foreground mb-5 leading-snug">
              {getContent('business_section').title || t('business.title')}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              {getContent('business_section').content || t('business.subtitle')}
            </p>
          </div>

          <InteractiveSplitBusiness businesses={businesses} />
        </div>
      </section>

      {/* News Section */}
      <section
        ref={newsRef}
        className={`home-section home-news bg-background ${newsInView ? 'is-revealed' : ''}
          }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="home-section-heading text-center mb-10 sm:mb-14">
            <h2 className="home-heading font-bold text-foreground mb-5 leading-snug">
              {getContent('news_section').title || t('news.title')}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-7">
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
        className={`home-section home-careers relative overflow-hidden ${careersInView ? 'is-revealed' : ''}
          }`}
      >
        {/* Animated Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-foreground/20 animate-float-particle"
            style={{
              width: `${(i % 3) * 2 + 4}px`,
              height: `${(i % 3) * 2 + 4}px`,
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 37 + 11) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${(i % 4) * 2 + 14}s`,
            }}
          />
        ))}

        {/* Sparkle Effects */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 37 + 11) % 100}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary-foreground/40">
              <path
                fill="currentColor"
                d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z"
              />
            </svg>
          </div>
        ))}

        <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="home-heading font-bold mb-5 text-primary-foreground leading-snug">
            {getContent('careers_section').title || t('careers.title')}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 text-primary-foreground/90">
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
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <NewsletterForm />
        </div>
      </section>

      {/* Google Map Section */}
      <GoogleMapSection />
    </div>
  );
};

export default Index;
