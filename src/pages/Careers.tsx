import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock } from 'lucide-react';

const Careers = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const jobs = [
    {
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Bangkok',
      type: 'Full-time',
      description: 'วางแผนและบริหารกลยุทธ์การตลาดดิจิทัล สร้างแคมเปญออนไลน์',
    },
    {
      title: 'Property Sales Executive',
      department: 'Real Estate',
      location: 'Bangkok',
      type: 'Full-time',
      description: 'ขายและนำเสนอโครงการอสังหาริมทรัพย์ ดูแลลูกค้าและปิดการขาย',
    },
    {
      title: 'Veterinarian',
      department: '3DPet Hospital',
      location: 'Bangkok',
      type: 'Full-time',
      description: 'ให้บริการรักษาสัตว์ ตรวจวินิจฉัย และดูแลสุขภาพสัตว์เลี้ยง',
    },
    {
      title: 'Hotel Manager',
      department: '12 The Residence',
      location: 'Bangkok',
      type: 'Full-time',
      description: 'บริหารจัดการโรงแรม ดูแลการบริการและความพึงพอใจของแขก',
    },
  ];

  const benefits = [
    'ประกันสุขภาพและอุบัติเหตุ',
    'โบนัสประจำปี',
    'วันหยุดพักผ่อนประจำปี',
    'ค่าเดินทาง',
    'ส่วนลดสินค้าและบริการในเครือ',
    'โอกาสในการพัฒนาและเติบโตในสายงาน',
  ];

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
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('careers.benefits')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CardContent className="pt-6">
                  <p className="text-center">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-3xl font-bold mb-6">{t('careers.positions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 hover:shadow-lg ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge>{job.department}</Badge>
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{job.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">{t('careers.apply')}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
