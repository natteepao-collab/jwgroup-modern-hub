import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building2, Users, Briefcase, Award, ChevronDown, ChevronUp, Calendar, Trophy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { publicAchievementCount } from '@/lib/publicContent';

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
  inView,
  isClickable,
  isExpanded,
  onClick,
  children
}: { 
  icon: React.ReactNode;
  value: number | null;
  suffix: string;
  label: string;
  index: number;
  inView: boolean;
  isClickable?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const count = useCountUp(value ?? 0, 2500, inView);

  return (
    <div className="relative">
      <Button
        asChild
        variant="ghost"
        className="h-auto w-full whitespace-normal text-left justify-start"
      >
      <div
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-expanded={isClickable ? Boolean(isExpanded) : undefined}
        aria-label={isClickable ? label : undefined}
        onKeyDown={(event) => {
          if (isClickable && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick?.();
          }
        }}
        onClick={isClickable ? onClick : undefined}
        className={`relative group block p-5 sm:p-7 rounded-lg bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 ${isClickable ? 'cursor-pointer' : ''} ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
      >
        {/* Gradient background on hover */}
        <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className="relative mb-2 sm:mb-4 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-7 sm:[&_svg]:h-7 md:[&_svg]:w-8 md:[&_svg]:h-8">
          {icon}
        </div>

        {/* Value */}
        <div className="relative flex items-baseline gap-1 sm:gap-2 flex-wrap tabular-nums">
          {value !== null && <>
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-none">
            {value === 2550 ? count : count.toLocaleString()}
          </span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-none">
            {suffix}
          </span>
          </>}
          {isClickable && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* Label */}
        <p className="relative mt-1 sm:mt-2 text-sm leading-relaxed md:text-base text-muted-foreground font-medium">
          {label}
        </p>
      </div>

      </Button>

      {/* Dropdown Content */}
      {children && (
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px] opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// Helper to parse image_url which can be JSON array or single URL
const parseAwardImage = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0]; // Return first image
    }
    return imageUrl;
  } catch {
    return imageUrl; // Return as-is if not JSON
  }
};

const AnimatedStats = () => {
  const { t, i18n } = useTranslation();
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
    <section className="pt-4 pb-16 sm:pb-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {t('refinement.portfolio')}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            {t('refinement.portfolioDesc')}
          </p>
        </div>

        {/* Stats Grid - 3 stat cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {/* Completed Projects - Clickable */}
          <StatCard
            icon={<Briefcase className="w-8 h-8" />}
            value={publicAchievementCount(projects)}
            suffix=""
            label={t('about.history')}
            index={1}
            inView={inView}
            isClickable={projects.length > 0}
            isExpanded={expandedSection === 'projects'}
            onClick={() => projects.length > 0 && toggleSection('projects')}
          />

          {/* Awards - Clickable */}
          <StatCard
            icon={<Award className="w-8 h-8" />}
            value={publicAchievementCount(awards)}
            suffix=""
            label={t('about.awards')}
            index={2}
            inView={inView}
            isClickable={awards.length > 0}
            isExpanded={expandedSection === 'awards'}
            onClick={() => awards.length > 0 && toggleSection('awards')}
          />
        </div>


        {/* Expandable Dropdown Panel - full-width on all screens */}
        <div
          className={`max-w-5xl mx-auto overflow-hidden transition-all duration-500 ${
            expandedSection ? 'max-h-[600px] opacity-100 mt-4 sm:mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          {expandedSection === 'projects' && (
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg max-h-[500px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">{t('about.history')}</h4>
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
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {getTitle(project)}
                      </p>
                      <p className="text-sm text-muted-foreground">{t('stats.year')} {project.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expandedSection === 'awards' && (
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg max-h-[500px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <Trophy className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">{t('stats.allAwards')}</h4>
              </div>
              <div className="space-y-3">
                {awards.map((award) => {
                  const awardImageUrl = parseAwardImage(award.image_url);
                  return (
                    <Link
                      to="/awards"
                      key={award.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors group cursor-pointer"
                    >
                      {awardImageUrl ? (
                        <img
                          src={awardImageUrl}
                          alt={getTitle(award)}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {getTitle(award)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {award.award_year && `${t('stats.year')} ${award.award_year}`}
                          {award.awarding_organization && ` • ${award.awarding_organization}`}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>



      </div>
    </section>
  );
};

export default AnimatedStats;