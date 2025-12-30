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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">เกี่ยวกับเรา</h2>
                <p className="text-sm text-muted-foreground">ข้อมูลองค์กร JW Group</p>
              </div>

              {/* Navigation Items */}
              <nav className="relative">
                {/* Decorative Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden lg:block" />

                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0">
                  {navItems.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 min-w-max lg:min-w-0",
                          active
                            ? "bg-primary/10 border-2 border-primary/30 shadow-lg shadow-primary/10"
                            : "bg-card hover:bg-muted/80 border-2 border-transparent hover:border-primary/20"
                        )}
                      >
                        {/* Icon Container */}
                        <div className={cn(
                          "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                          active
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                          <item.icon className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            active ? "scale-110" : "group-hover:scale-110"
                          )} />
                          
                          {/* Active Indicator Dot */}
                          {active && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
                          )}
                        </div>

                        {/* Label */}
                        <span className={cn(
                          "text-sm font-medium transition-colors duration-300 whitespace-nowrap lg:whitespace-normal",
                          active
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary"
                        )}>
                          {t(item.labelKey)}
                        </span>

                        {/* Arrow Indicator */}
                        <svg 
                          className={cn(
                            "hidden lg:block w-4 h-4 ml-auto transition-all duration-300",
                            active
                              ? "opacity-100 text-primary translate-x-0"
                              : "opacity-0 text-muted-foreground -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Quick Stats */}
              <div className="hidden lg:block mt-8 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">17+</p>
                    <p className="text-xs text-muted-foreground">ปีแห่งประสบการณ์</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">4</p>
                    <p className="text-xs text-muted-foreground">กลุ่มธุรกิจหลัก</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
              <Routes>
                <Route path="history" element={<AboutHistory />} />
                <Route path="vision" element={<AboutVision />} />
                <Route path="structure" element={<AboutStructure />} />
                <Route path="team" element={<AboutTeam />} />
                {/* Awards moved to detailed page */}
                <Route path="*" element={<AboutHistory />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default About;
