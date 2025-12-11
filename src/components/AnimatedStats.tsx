import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building2, Users, Briefcase, Award, ChevronDown, ChevronUp, Calendar, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface TimelineEvent {
  id: string;
  year: string;
  title_th: string;
  title_en: string | null;
  image_url: string | null;
}

interface AwardItem {
  id: string;
  title_th: string;
  title_en: string | null;
  award_year: number | null;
  awarding_organization: string | null;
  image_url: string | null;
}

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      countRef.current = Math.floor(easeOutQuart * end);
      setCount(countRef.current);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, start]);

  return count;
};

const StatCard = ({ 
  icon, 
  value, 
  suffix, 
  label, 
  index, 
  inView,
  isClickable,
  isExpanded,
  onClick,
  children
}: { 
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  index: number;
  inView: boolean;
  isClickable?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const count = useCountUp(value, 2500, inView);

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={`relative group p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
          inView ? 'animate-fade-in opacity-100' : 'opacity-0'
        } ${isClickable ? 'cursor-pointer' : ''} ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {/* Gradient background on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className="relative mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>

        {/* Value */}
        <div className="relative flex items-center gap-2">
          <span className="text-4xl md:text-5xl font-bold text-foreground">
            {value === 2550 ? count : count.toLocaleString()}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-primary">
            {suffix}
          </span>
          {isClickable && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* Label */}
        <p className="relative mt-2 text-muted-foreground font-medium">
          {label}
        </p>
      </div>

      {/* Dropdown Content */}
      {children && (
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

const AnimatedStats = () => {
  const { i18n } = useTranslation();
  const [projects, setProjects] = useState<TimelineEvent[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch timeline events (projects)
      const { data: timelineData } = await supabase
        .from('timeline_events')
        .select('id, year, title_th, title_en, image_url')
        .eq('is_published', true)
        .order('year', { ascending: true });

      if (timelineData) {
        setProjects(timelineData);
      }

      // Fetch awards
      const { data: awardsData } = await supabase
        .from('awards')
        .select('id, title_th, title_en, award_year, awarding_organization, image_url')
        .eq('is_published', true)
        .order('award_year', { ascending: false });

      if (awardsData) {
        setAwards(awardsData);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getTitle = (item: { title_th: string; title_en: string | null }) => {
    return i18n.language === 'en' && item.title_en ? item.title_en : item.title_th;
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ความสำเร็จของเรา
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ตัวเลขที่บ่งบอกถึงความมุ่งมั่นและความสำเร็จของ JW Group ตลอดระยะเวลาที่ผ่านมา
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {/* Year Founded */}
          <StatCard
            icon={<Building2 className="w-8 h-8" />}
            value={2550}
            suffix=""
            label="ปีที่ก่อตั้ง"
            index={0}
            inView={inView}
          />

          {/* Completed Projects - Clickable */}
          <StatCard
            icon={<Briefcase className="w-8 h-8" />}
            value={projects.length || 50}
            suffix="+"
            label="โครงการที่สำเร็จ"
            index={1}
            inView={inView}
            isClickable={true}
            isExpanded={expandedSection === 'projects'}
            onClick={() => toggleSection('projects')}
          >
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg max-h-[400px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">รายการโครงการทั้งหมด</h4>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={getTitle(project)}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {getTitle(project)}
                      </p>
                      <p className="text-sm text-muted-foreground">ปี {project.year}</p>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">กำลังโหลดข้อมูล...</p>
                )}
              </div>
            </div>
          </StatCard>

          {/* Happy Customers */}
          <StatCard
            icon={<Users className="w-8 h-8" />}
            value={10000}
            suffix="+"
            label="ลูกค้าที่ไว้วางใจ"
            index={2}
            inView={inView}
          />

          {/* Awards - Clickable */}
          <StatCard
            icon={<Award className="w-8 h-8" />}
            value={awards.length || 15}
            suffix="+"
            label="รางวัลที่ได้รับ"
            index={3}
            inView={inView}
            isClickable={true}
            isExpanded={expandedSection === 'awards'}
            onClick={() => toggleSection('awards')}
          >
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg max-h-[400px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <Trophy className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">รางวัลที่ได้รับทั้งหมด</h4>
              </div>
              <div className="space-y-3">
                {awards.map((award) => (
                  <div 
                    key={award.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {award.image_url ? (
                      <img 
                        src={award.image_url} 
                        alt={getTitle(award)}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {getTitle(award)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {award.award_year && `ปี ${award.award_year}`}
                        {award.awarding_organization && ` • ${award.awarding_organization}`}
                      </p>
                    </div>
                  </div>
                ))}
                {awards.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">กำลังโหลดข้อมูล...</p>
                )}
              </div>
            </div>
          </StatCard>
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;