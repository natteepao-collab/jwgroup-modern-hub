import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, Gift, Shield, Calendar, Car, Percent, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JobApplicationForm from '@/components/JobApplicationForm';

// Icon mapping for benefits
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  shield: Shield,
  calendar: Calendar,
  car: Car,
  percent: Percent,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
};

interface Job {
  id: string;
  title_th: string;
  title_en: string | null;
  department_th: string | null;
  department_en: string | null;
  location_th: string | null;
  location_en: string | null;
  job_type: string | null;
  description_th: string | null;
  description_en: string | null;
}

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isEnglish = i18n.language === 'en';

  // Fetch jobs from database
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_published', true)
        .order('position_order');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch benefits from database
  const { data: benefits = [] } = useQuery({
    queryKey: ['career_benefits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_benefits')
        .select('*')
        .eq('is_published', true)
        .order('position_order');
      
      if (error) throw error;
      return data || [];
    }
  });

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return isEnglish ? 'Full-time' : 'เต็มเวลา';
      case 'part-time': return isEnglish ? 'Part-time' : 'พาร์ทไทม์';
      case 'contract': return isEnglish ? 'Contract' : 'สัญญาจ้าง';
      case 'internship': return isEnglish ? 'Internship' : 'ฝึกงาน';
      default: return type;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('careers.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('careers.description')}
          </p>
        </div>

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('careers.benefits')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon_name || 'gift'] || Gift;
                return (
                  <Card
                    key={benefit.id}
                    className={`transition-all duration-500 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {isEnglish ? (benefit.title_en || benefit.title_th) : benefit.title_th}
                          </p>
                          {(isEnglish ? benefit.description_en : benefit.description_th) && (
                            <p className="text-sm text-muted-foreground">
                              {isEnglish ? benefit.description_en : benefit.description_th}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div>
          <h2 className="text-3xl font-bold mb-6">{t('careers.positions')}</h2>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <Card
                  key={job.id}
                  className={`transition-all duration-500 hover:shadow-lg ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">
                        {isEnglish ? (job.title_en || job.title_th) : job.title_th}
                      </CardTitle>
                      <Badge>
                        {isEnglish 
                          ? (job.department_en || job.department_th) 
                          : job.department_th}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {isEnglish 
                            ? (job.location_en || job.location_th) 
                            : job.location_th}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getJobTypeLabel(job.job_type || 'full-time')}</span>
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {isEnglish 
                        ? (job.description_en || job.description_th) 
                        : job.description_th}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedJob(job)}
                    >
                      {t('careers.apply')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isEnglish 
                    ? 'No positions available at the moment. Please check back later.' 
                    : 'ไม่มีตำแหน่งงานว่างในขณะนี้ กรุณากลับมาตรวจสอบภายหลัง'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job Application Form Modal */}
        {selectedJob && (
          <JobApplicationForm
            jobId={selectedJob.id}
            jobTitle={isEnglish ? (selectedJob.title_en || selectedJob.title_th) : selectedJob.title_th}
            open={!!selectedJob}
            onOpenChange={(open) => !open && setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Careers;
