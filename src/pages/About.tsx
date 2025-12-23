import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info, Eye, Network, UserCircle, Award } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Building2, Hotel, Stethoscope, Leaf } from 'lucide-react';
import OrganizationChart from '@/components/OrganizationChart';

const AboutHistory = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary">JW GROUP: จากรากฐานอสังหาริมทรัพย์ สู่ผู้นำธุรกิจไลฟ์สไตล์ครบวงจร</h2>
      <div className="prose max-w-none dark:prose-invert">
        <p className="text-lg mb-6 leading-relaxed text-muted-foreground">
          ก่อตั้งขึ้นเมื่อปี 2550 โดยเริ่มต้นจากความเชี่ยวชาญในธุรกิจอสังหาริมทรัพย์ ด้วยปณิธานแน่วแน่ของผู้บริหารที่ต้องการสร้างสรรค์ที่อยู่อาศัยซึ่งไม่เพียงแค่สวยงาม แต่ต้องตอบโจทย์การใช้งานจริง และใช้สอยพื้นที่ให้เกิดประโยชน์สูงสุด เพื่อส่งมอบคุณค่าที่ยั่งยืนให้กับผู้อยู่อาศัย
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          จากความสำเร็จในทุกโครงการที่ผ่านมา นำไปสู่การเติบโตและขยายขอบเขตธุรกิจอย่างต่อเนื่อง ปัจจุบัน JW GROUP คือกลุ่มธุรกิจชั้นนำที่ครอบคลุมทั้งด้านอสังหาริมทรัพย์ โรงแรม ธุรกิจโรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ โดยยังคงยึดมั่นในภารกิจสำคัญ คือการสร้างสรรค์นวัตกรรมเพื่อยกระดับคุณภาพชีวิตที่ดีกว่าให้กับทุกคน
        </p>
      </div>
    </div>
  );
};

const AboutVision = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">{t('about.vision')}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>วิสัยทัศน์</CardTitle>
          </CardHeader>
          <CardContent>
            <p>เป็นกลุ่มธุรกิจชั้นนำที่สร้างสรรค์นวัตกรรมและคุณค่าที่ยั่งยืนให้กับสังคม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>พันธกิจ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>นำเสนอผลิตภัณฑ์และบริการคุณภาพสูง</li>
              <li>พัฒนานวัตกรรมอย่างต่อเนื่อง</li>
              <li>สร้างคุณค่าให้กับลูกค้าและสังคม</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AboutStructure = () => {
  return <OrganizationChart />;
};

const AboutTeam = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">{t('about.team')}</h1>
      <p className="text-lg mb-8">ทีมผู้บริหารของเราประกอบด้วยผู้เชี่ยวชาญที่มีประสบการณ์กว่า 20 ปีในแต่ละอุตสาหกรรม</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>ผู้บริหาร {i}</CardTitle>
              <CardDescription>ตำแหน่ง</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">ประสบการณ์และความเชี่ยวชาญในอุตสาหกรรม</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AboutAwards = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">{t('about.awards')}</h1>
      <div className="space-y-6">
        {[
          { year: '2024', award: 'รางวัลบริษัทดีเด่นแห่งปี' },
          { year: '2023', award: 'รางวัลนวัตกรรมธุรกิจอสังหาริมทรัพย์' },
          { year: '2022', award: 'รางวัลโรงแรมบูติกยอดเยี่ยม' },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{item.year}</CardTitle>
              <CardDescription className="text-lg">{item.award}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

const About = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/about/history', labelKey: 'about.history', icon: Info },
    { path: '/about/vision', labelKey: 'about.vision', icon: Eye },
    { path: '/about/structure', labelKey: 'about.structure', icon: Network },
    { path: '/about/team', labelKey: 'about.team', icon: UserCircle },
    { path: '/about/awards', labelKey: 'about.awards', icon: Award },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation - Responsive & Scrollable */}
        <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-muted-foreground/50 hidden sm:block">•</span>
                )}
                <Link
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="whitespace-nowrap">{t(item.labelKey)}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Routes>
          <Route path="history" element={<AboutHistory />} />
          <Route path="vision" element={<AboutVision />} />
          <Route path="structure" element={<AboutStructure />} />
          <Route path="team" element={<AboutTeam />} />
          <Route path="awards" element={<AboutAwards />} />
          <Route path="*" element={<AboutHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default About;
