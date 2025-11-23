import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Users } from 'lucide-react';
import { BusinessCard } from '@/components/BusinessCard';
import { NewsCard } from '@/components/NewsCard';
import heroBg from '@/assets/hero-bg.jpg';
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
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div
          className={`container mx-auto px-4 relative z-10 text-center transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            {t('hero.headline')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {t('hero.subheadline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/about/history">{t('hero.ctaLearn')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg">
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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('business.title')}
            </h2>
            <p className="text-lg text-muted-foreground">{t('business.subtitle')}</p>
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
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('news.title')}
            </h2>
            <Button asChild variant="outline">
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
        className={`py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground transition-all duration-1000 ${
          careersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('careers.title')}</h2>
          <p className="text-xl mb-8 opacity-90">{t('careers.description')}</p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg"
          >
            <Link to="/careers">{t('careers.viewPositions')}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
