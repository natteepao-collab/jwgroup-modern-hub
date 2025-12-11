import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Trophy, Award as AwardIcon, Medal, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface Award {
  id: string;
  title_th: string;
  title_en: string | null;
  title_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  image_url: string | null;
  award_year: number | null;
  awarding_organization: string | null;
  category: string;
}

// Mock data for initial display
const mockAwards: Award[] = [
  {
    id: '1',
    title_th: 'รางวัลอสังหาริมทรัพย์ดีเด่น',
    title_en: 'Outstanding Real Estate Award',
    title_cn: null,
    description_th: 'รางวัลสำหรับโครงการอสังหาริมทรัพย์ที่มีคุณภาพและการออกแบบที่โดดเด่น',
    description_en: 'Award for quality real estate projects with outstanding design',
    description_cn: null,
    image_url: null,
    award_year: 2023,
    awarding_organization: 'สมาคมอสังหาริมทรัพย์ไทย',
    category: 'award',
  },
  {
    id: '2',
    title_th: 'โรงแรมบูติกยอดเยี่ยม',
    title_en: 'Best Boutique Hotel',
    title_cn: null,
    description_th: 'รางวัลโรงแรมบูติกที่ให้บริการดีเยี่ยมและมีเอกลักษณ์โดดเด่น',
    description_en: 'Award for boutique hotel with excellent service and unique character',
    description_cn: null,
    image_url: null,
    award_year: 2022,
    awarding_organization: 'Thailand Tourism Awards',
    category: 'award',
  },
  {
    id: '3',
    title_th: 'มาตรฐาน ISO 9001:2015',
    title_en: 'ISO 9001:2015 Certification',
    title_cn: null,
    description_th: 'การรับรองมาตรฐานระบบบริหารคุณภาพระดับสากล',
    description_en: 'International quality management system certification',
    description_cn: null,
    image_url: null,
    award_year: 2021,
    awarding_organization: 'International Organization for Standardization',
    category: 'certification',
  },
  {
    id: '4',
    title_th: 'องค์กรรับผิดชอบต่อสังคม',
    title_en: 'CSR Excellence Award',
    title_cn: null,
    description_th: 'รางวัลองค์กรที่มีความรับผิดชอบต่อสังคมและสิ่งแวดล้อม',
    description_en: 'Award for corporate social responsibility and environmental care',
    description_cn: null,
    image_url: null,
    award_year: 2023,
    awarding_organization: 'กระทรวงพัฒนาสังคมและความมั่นคงของมนุษย์',
    category: 'award',
  },
];

const AwardCard = ({ award, index, inView }: { award: Award; index: number; inView: boolean }) => {
  const { i18n } = useTranslation();

  const getTitle = () => {
    const lang = i18n.language;
    if (lang === 'en' && award.title_en) return award.title_en;
    if (lang === 'cn' && award.title_cn) return award.title_cn;
    return award.title_th;
  };

  const getDescription = () => {
    const lang = i18n.language;
    if (lang === 'en' && award.description_en) return award.description_en;
    if (lang === 'cn' && award.description_cn) return award.description_cn;
    return award.description_th;
  };

  const getIcon = () => {
    if (award.category === 'certification') {
      return <Medal className="w-8 h-8" />;
    }
    return index % 2 === 0 ? <Trophy className="w-8 h-8" /> : <AwardIcon className="w-8 h-8" />;
  };

  return (
    <div
      className={`group relative bg-card rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="relative mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {award.image_url ? (
          <img
            src={award.image_url}
            alt={getTitle()}
            className="w-12 h-12 object-contain"
          />
        ) : (
          getIcon()
        )}
      </div>

      {/* Year Badge */}
      {award.award_year && (
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary">
          {award.award_year}
        </span>
      )}

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
          {getTitle()}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {getDescription()}
        </p>
        {award.awarding_organization && (
          <p className="text-xs text-primary font-medium flex items-center gap-1">
            <Star className="w-3 h-3" />
            {award.awarding_organization}
          </p>
        )}
      </div>
    </div>
  );
};

const AwardsSection = () => {
  const [awards, setAwards] = useState<Award[]>(mockAwards);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchAwards = async () => {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_published', true)
        .order('position_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setAwards(data);
      }
    };

    fetchAwards();
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            รางวัลและการรับรอง
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ความสำเร็จและการยอมรับจากองค์กรชั้นนำ ที่สะท้อนถึงมาตรฐานและคุณภาพของเรา
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <AwardCard key={award.id} award={award} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
