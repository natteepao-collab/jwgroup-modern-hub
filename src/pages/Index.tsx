import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Users } from 'lucide-react';
import { BusinessCard } from '@/components/BusinessCard';
import { NewsCard } from '@/components/NewsCard';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import Hero3DBackground from '@/components/Hero3DBackground';
import realEstate from '@/assets/business-realestate.jpg';
import hotel from '@/assets/business-hotel.jpg';
import pet from '@/assets/business-pet.jpg';
import wellness from '@/assets/business-wellness.jpg';

const Index = () => {
  const { t } = useTranslation();

  // Scroll reveal animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [businessRef, businessInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [newsRef, newsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [careersRef, careersInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const businesses = [
    {
      name: t('business.realEstate.name'),
      description: t('business.realEstate.description'),
      url: 'https://jwrealestate.com',
      image: realEstate,
    },
    {
      name: t('business.hotel.name'),
      description: t('business.hotel.description'),
      url: 'https://12theresidence.com/th-th/',
      image: hotel,
    },
    {
      name: t('business.pet.name'),
      description: t('business.pet.description'),
      url: 'https://www.3dpethospital.com/',
      image: pet,
    },
    {
      name: t('business.wellness.name'),
      description: t('business.wellness.description'),
      url: 'https://jwherbal-roots-and-remedies.lovable.app',
      image: wellness,
    },
  ];

  const mockNews = [
    {
      id: '1',
      title: 'JW Group เปิดตัวโครงการอสังหาริมทรัพย์ใหม่มูลค่ากว่า 5,000 ล้านบาท',
      excerpt: 'กลุ่มบริษัท JW Group ประกาศเปิดตัวโครงการอสังหาริมทรัพย์ระดับพรีเมียมใจกลางกรุงเทพฯ...',
      category: t('news.companyNews'),
      date: '2024-01-15',
      image: realEstate,
    },
    {
      id: '2',
      title: '12 The Residence Hotel คว้ารางวัลโรงแรมบูติกยอดเยี่ยม 2024',
      excerpt: 'โรงแรม 12 The Residence ได้รับรางวัลโรงแรมบูติกยอดเยี่ยมแห่งปี 2024 จากสมาคมโรงแรมไทย...',
      category: t('news.pressRelease'),
      date: '2024-01-10',
      image: hotel,
    },
    {
      id: '3',
      title: '3DPet Hospital เปิดสาขาใหม่ พร้อมเทคโนโลยีการรักษาสัตว์ล้ำสมัย',
      excerpt: 'โรงพยาบาลสัตว์ 3DPet ขยายสาขาครั้งใหญ่ พร้อมนำเข้าเทคโนโลยีการรักษาสัตว์ระดับโลก...',
      category: t('news.companyNews'),
      date: '2024-01-05',
      image: pet,
    },
  ];

  return (
    <div className="min-h-screen">
      <AnnouncementModal autoShow delay={1500} />
      
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20"
      >
        <Hero3DBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div
          className={`container mx-auto px-4 relative z-10 text-center transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="mb-4">
            <p className="text-primary text-lg md:text-xl font-bold tracking-wide uppercase mb-2 drop-shadow-lg">
              {t('hero.welcome')}
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            {t('hero.headline')}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-4 max-w-4xl mx-auto font-light drop-shadow-lg">
            {t('hero.tagline')}
          </p>
          <p className="text-base md:text-lg text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-lg">
            {t('hero.subheadline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
              <Link to="/about/history">{t('hero.ctaLearn')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
              <Link to="/business">{t('hero.ctaBusiness')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className={`py-20 bg-background transition-all duration-1000 ${
          aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('aboutSection.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('aboutSection.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">{t('aboutSection.yearsLabel')}</div>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-muted-foreground">{t('aboutSection.businessLabel')}</div>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">{t('aboutSection.visionLabel')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section
        ref={businessRef}
        className={`py-20 bg-accent/20 transition-all duration-1000 ${
          businessInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
              {t('business.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('business.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((business, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  businessInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <BusinessCard {...business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section
        ref={newsRef}
        className={`py-20 bg-background transition-all duration-1000 ${
          newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
              {t('news.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">{t('news.subtitle')}</p>
            <Button asChild variant="outline" size="lg">
              <Link to="/news" className="flex items-center gap-2">
                {t('news.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.map((news, index) => (
              <div
                key={news.id}
                className={`transition-all duration-500 ${
                  newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <NewsCard {...news} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Teaser Section */}
      <section
        ref={careersRef}
        className={`py-20 relative overflow-hidden transition-all duration-1000 ${
          careersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Orange Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">{t('careers.title')}</h2>
          <p className="text-xl mb-8 text-white/90 drop-shadow-md">{t('careers.description')}</p>
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
    </div>
  );
};

export default Index;
